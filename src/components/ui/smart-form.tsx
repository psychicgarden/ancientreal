import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { useErrorHandler } from '@/lib/error-handler';

interface AsyncFormProps {
  onSubmit: (data: any) => Promise<any>;
  children: (state: {
    isLoading: boolean;
    submit: (data: any) => Promise<void>;
    error: string | null;
  }) => React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}

export const AsyncForm: React.FC<AsyncFormProps> = ({
  onSubmit,
  children,
  className = '',
  resetOnSuccess = true
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { execute } = useAsyncOperation();
  const { handleError, handleSuccess } = useErrorHandler();

  const submit = async (data: any) => {
    setError(null);
    setIsLoading(true);

    try {
      await execute(
        () => onSubmit(data),
        {
          key: 'form-submit',
          onSuccess: (result) => {
            if (resetOnSuccess && typeof data === 'object') {
              // Reset form fields if data is an object with setters
              Object.keys(data).forEach(key => {
                if (typeof data[key] === 'function' && key.startsWith('set')) {
                  data[key]('');
                }
              });
            }
            handleSuccess('Operation completed successfully');
          },
          onError: (error) => {
            const errorMessage = error.message || 'Operation failed';
            setError(errorMessage);
            handleError(error, {
              operation: 'form_submit',
              component: 'AsyncForm'
            });
          }
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      {children({ isLoading, submit, error })}
    </div>
  );
};

interface SmartButtonProps {
  onClick?: () => Promise<void> | void;
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
  loadingText?: string;
}

export const SmartButton: React.FC<SmartButtonProps> = ({
  onClick,
  children,
  loadingText = 'Loading...',
  disabled = false,
  ...buttonProps
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const handleClick = async () => {
    if (!onClick || isLoading) return;

    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      handleError(error, {
        operation: 'button_click',
        component: 'SmartButton'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      {...buttonProps}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <LoadingState variant="inline" message={loadingText} />
      ) : (
        children
      )}
    </Button>
  );
};