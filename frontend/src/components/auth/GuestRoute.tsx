'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface GuestRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function GuestRoute({ 
  children, 
  redirectTo = '/' 
}: GuestRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsGuest(!authenticated);
      setIsLoading(false);

      if (authenticated) {
        router.push(redirectTo);
      }
    };

    checkAuth();
  }, [router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isGuest) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
