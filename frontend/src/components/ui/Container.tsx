import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export default function Container({ 
  children, 
  size = 'lg', 
  className = '' 
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
    full: 'max-w-full'
  };

  const containerClasses = `
    mx-auto px-4 sm:px-6 lg:px-8
    ${sizeClasses[size]}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}
