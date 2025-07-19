import React from 'react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <Container size="md" className="w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Instagram</h1>
          {subtitle && (
            <p className="text-gray-600 font-semibold">{subtitle}</p>
          )}
        </div>

        {/* Main Content */}
        <Card>
          {children}
        </Card>
      </Container>
    </div>
  );
}
