import React from 'react';
import { useForm, UseFormReturn, FieldValues, DefaultValues, SubmitHandler, FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useErrorHandler } from '@/lib/error-handler';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

interface ValidatedFormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  onSubmit: SubmitHandler<T>;
  defaultValues?: DefaultValues<T>;
  children: (form: UseFormReturn<T>) => React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  successMessage?: string;
  loadingMessage?: string;
  submitText?: string;
  showSubmitButton?: boolean;
  disabled?: boolean;
}

export function ValidatedForm<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className = '',
  resetOnSuccess = false,
  successMessage,
  loadingMessage = 'Processing...',
  submitText = 'Submit',
  showSubmitButton = true,
  disabled = false,
}: ValidatedFormProps<T>) {
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const { handleError, handleSuccess } = useErrorHandler();
  const { execute } = useAsyncOperation();

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange', // Validate on change for better UX
  });

  const handleSubmit = form.handleSubmit(async (data: T) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      await execute(
        () => Promise.resolve(onSubmit(data)),
        {
          key: 'form-submit',
          onSuccess: (result) => {
            if (resetOnSuccess) {
              form.reset();
            }
            if (successMessage) {
              setSubmitSuccess(successMessage);
              handleSuccess(successMessage);
            }
          },
          onError: (error) => {
            const errorMessage = error.message || 'Submission failed';
            setSubmitError(errorMessage);
            handleError(error, {
              operation: 'form_submit',
              component: 'ValidatedForm',
              userAction: 'Submit form'
            });
          }
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {children(form)}
          
          {/* Error Display */}
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
          
          {/* Success Display */}
          {submitSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{submitSuccess}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          {showSubmitButton && (
            <Button
              type="submit"
              disabled={disabled || isSubmitting || !form.formState.isValid}
              className="w-full"
            >
              {isSubmitting ? (
                <LoadingState variant="inline" message={loadingMessage} />
              ) : (
                submitText
              )}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}

// Higher-order component for wrapping existing forms with validation
export function withValidation<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  Component: React.ComponentType<{ form: UseFormReturn<T> }>
) {
  return function ValidatedComponent(props: Omit<ValidatedFormProps<T>, 'children'>) {
    return (
      <ValidatedForm schema={schema} {...props}>
        {(form) => <Component form={form} />}
      </ValidatedForm>
    );
  };
}

// Custom hook for form validation with error handling
export function useValidatedForm<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: DefaultValues<T>
) {
  const { handleError } = useErrorHandler();
  
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const validateField = (fieldName: FieldPath<T>, value: any) => {
    try {
      // For Zod schemas, we need to validate the entire object
      // This is a simplified validation - for production use, consider partial validation
      const testData = { ...form.getValues(), [fieldName]: value };
      schema.parse(testData);
      form.clearErrors(fieldName);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find(issue => 
          issue.path.length > 0 && issue.path[0] === fieldName
        );
        if (fieldError) {
          form.setError(fieldName, {
            type: 'validation',
            message: fieldError.message,
          });
        }
      }
      return false;
    }
  };

  const validateAllFields = () => {
    try {
      schema.parse(form.getValues());
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            const fieldName = issue.path[0] as FieldPath<T>;
            form.setError(fieldName, {
              type: 'validation',
              message: issue.message,
            });
          }
        });
        
        handleError(new Error('Form validation failed'), {
          operation: 'form_validation',
          component: 'useValidatedForm',
          additionalData: { errors: error.issues }
        });
      }
      return false;
    }
  };

  return {
    form,
    validateField,
    validateAllFields,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
  };
}

// Form field wrapper with enhanced validation feedback
interface ValidatedFieldProps {
  children: React.ReactNode;
  error?: string;
  success?: boolean;
  className?: string;
}

export const ValidatedField: React.FC<ValidatedFieldProps> = ({
  children,
  error,
  success,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
      {error && (
        <div className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-1 text-sm text-green-600">
          <CheckCircle className="h-3 w-3" />
          <span>Valid</span>
        </div>
      )}
    </div>
  );
};