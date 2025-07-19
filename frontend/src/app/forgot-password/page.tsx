'use client';

import { useState } from 'react';
import Link from 'next/link';
import { checkUserExists, resetPassword } from '@/lib/auth';
import GuestRoute from '@/components/auth/GuestRoute';

function ForgotPasswordForm() {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userExists = await checkUserExists(formData.email);

    if (userExists) {
      setStep('reset');
      setSuccess('User found! Please enter your new password.');
    } else {
      setError('No account found with this email address.');
    }

    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    const result = await resetPassword(formData.email, formData.newPassword);

    if (result.success) {
      setSuccess('Password reset successful! You can now log in with your new password.');
      // Reset form
      setFormData({ email: '', newPassword: '', confirmPassword: '' });
      setStep('email');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Back Button */}
      <div className="flex items-center px-4 py-4">
        <Link href="/login" className="p-2">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pt-4">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">Find your account</h1>

        {/* Description */}
        <div className="mb-10">
          <p className="text-gray-600 text-base mb-2">
            Enter your username, email, or mobile number.
          </p>
          <Link href="#" className="text-blue-500 text-base">
            Can&apos;t reset your password?
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={step === 'email' ? handleEmailSubmit : handlePasswordReset} className="space-y-5">
          {step === 'email' ? (
            <>
              {/* Email Input */}
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Username, email, or mobile number"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-base placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                />
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors mt-6"
              >
                {loading ? 'Checking...' : 'Continue'}
              </button>

              {/* Facebook Login Button */}
              <button
                type="button"
                className="w-full border border-gray-300 text-gray-700 py-4 rounded-2xl font-semibold text-base hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Log In with Facebook</span>
              </button>
            </>
          ) : (
            <>
              {/* New Password Input */}
              <div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-base placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-base placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                />
              </div>

              {/* Reset Password Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors mt-6"
              >
                {loading ? 'Resetting...' : 'Reset password'}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-base text-gray-600 hover:text-gray-500 py-3"
              >
                ← Back to email entry
              </button>
            </>
          )}

        </form>

        {/* Messages */}
        {error && (
          <div className="mt-6 text-red-600 text-base text-center bg-red-50 p-4 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 text-green-600 text-base text-center bg-green-50 p-4 rounded-xl">
            {success}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <GuestRoute>
      <ForgotPasswordForm />
    </GuestRoute>
  );
}
