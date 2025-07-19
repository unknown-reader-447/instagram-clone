import React from 'react';
import Container from '@/components/ui/Container';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ 
  children, 
  className = '' 
}: MainLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <Container size="lg" className="py-8">
        {children}
      </Container>
    </div>
  );
}
