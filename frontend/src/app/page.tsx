'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logout, User } from '@/lib/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Instagram</h1>
            <p className="text-gray-600 mb-8">Welcome to Instagram Clone</p>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="block w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Instagram Clone!</h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Your Profile</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Full Name:</span> {user.fullName}</p>
                <p><span className="font-medium">Username:</span> @{user.username}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">🎉 Authentication Complete!</h3>
              <p className="text-sm text-blue-700">
                You have successfully logged in to the Instagram clone. The authentication system is working perfectly!
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">🚧 Coming Soon</h3>
              <p className="text-sm text-yellow-700">
                Photo sharing, stories, and other Instagram features will be added in future phases of development.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
