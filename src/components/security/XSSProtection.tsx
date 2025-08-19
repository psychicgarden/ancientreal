import React from 'react';
import DOMPurify from 'dompurify';

interface XSSProtectionProps {
  html: string;
  className?: string;
}

export function XSSProtection({ html, className }: XSSProtectionProps) {
  const sanitizedHTML = React.useMemo(() => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span', 'div'],
      ALLOWED_ATTR: ['class'],
    });
  }, [html]);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSecureChange?: (value: string) => void;
}

export function SecureInput({ onSecureChange, onChange, ...props }: SecureInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = DOMPurify.sanitize(e.target.value, { ALLOWED_TAGS: [] });
    
    if (onSecureChange) {
      onSecureChange(sanitizedValue);
    }
    
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: sanitizedValue }
      };
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return <input {...props} onChange={handleChange} />;
}