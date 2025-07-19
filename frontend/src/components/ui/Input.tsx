import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showLabel?: boolean;
}

export default function Input({
  label,
  error,
  helperText,
  showLabel = false,
  className = '',
  ...props
}: InputProps) {
  const baseClasses = `
    relative block w-full px-3 py-2 border rounded-md 
    focus:outline-none focus:ring-2 focus:ring-offset-0 focus:z-10 sm:text-sm
    transition-colors duration-200
  `;

  const normalClasses = `
    border-gray-300 placeholder-gray-500 text-gray-900
    focus:ring-blue-500 focus:border-blue-500
  `;

  const errorClasses = `
    border-red-300 placeholder-red-400 text-red-900
    focus:ring-red-500 focus:border-red-500
  `;

  const inputClasses = `${baseClasses} ${error ? errorClasses : normalClasses} ${className}`;

  return (
    <div className="space-y-1">
      {showLabel && label && (
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <input
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${props.name}-error` : helperText ? `${props.name}-helper` : undefined}
        {...props}
      />
      
      {error && (
        <p id={`${props.name}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p id={`${props.name}-helper`} className="text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
