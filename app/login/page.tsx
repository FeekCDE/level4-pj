'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleLogIn } from '../lib/authentication';

const initialState = {
  success: false,
  message: '',
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(handleLogIn, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/profile");
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white p-8 border border-gray-200 rounded-none shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-wide text-gray-800 mb-2">LOGIN</h1>
            <div className="h-px w-16 bg-gray-300 mx-auto"></div>
          </div>

          {state?.message && (
            <div 
              aria-live="polite"
              className={`mb-6 p-3 text-sm text-center border ${
                state.success 
                  ? 'text-gray-700 bg-gray-100 border-gray-300' 
                  : 'text-gray-700 bg-gray-100 border-gray-300'
              }`}
            >
              {state.message}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 bg-transparent outline-none transition duration-200"
                placeholder=""
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 bg-transparent outline-none transition duration-200"
                placeholder=""
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-normal tracking-wide focus:outline-none transition duration-200 ${
                isPending ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isPending ? 'PLEASE WAIT...' : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500 tracking-wide">
            Need an account?{' '}
            <Link href="/signup" className="font-medium text-gray-700 hover:text-gray-900 underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}