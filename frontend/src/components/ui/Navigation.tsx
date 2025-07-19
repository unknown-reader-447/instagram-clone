'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, logout, User } from '@/lib/auth';

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return null; // Don't render anything while loading
  }

  // Don't show navigation on auth pages
  const authPages = ['/login', '/register', '/forgot-password'];
  if (authPages.includes(pathname)) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-300 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Instagram
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.fullName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
