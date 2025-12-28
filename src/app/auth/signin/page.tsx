'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiShoppingBag,
  FiArrowLeft,
} from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/shop',
    });
    setLoading(false);

    if (res?.error) {
      setError('Invalid email or password');
    } else if (res?.ok) {
      window.location.href = res.url ?? '/shop';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1 opacity-30"></div>
        <div className="blob blob-2 opacity-30"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition-colors"
        >
          <FiArrowLeft />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-1">Sign in to continue shopping</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-500">!</span>
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  required
                  onChange={e => setEmail(e.target.value)}
                  className="input-modern pl-11"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  required
                  onChange={e => setPassword(e.target.value)}
                  className="input-modern pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <ImSpinner2 className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <FiLogIn />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Do not have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo: admin@test.com / password123</p>
        </div>
      </div>
    </div>
  );
}
