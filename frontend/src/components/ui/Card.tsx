import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '',
  padding = 'md',
  shadow = 'md'
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg'
  };

  const cardClasses = `
    bg-white border border-gray-300 rounded-lg
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${className}
  `;

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}
