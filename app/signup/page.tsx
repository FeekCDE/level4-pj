"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleSignUp } from "../../authentication";

const initialState = {
  success: false,
  message: "",
};

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(handleSignUp, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/login");
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-amber-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-amber-800 mb-2">Create Account</h1>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-amber-700">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-amber-600 hover:text-amber-800 underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {state?.message && (
            <div
              aria-live="polite"
              className={`mb-6 p-3 text-sm text-center rounded-lg ${
                state.success
                  ? "text-amber-800 bg-amber-100 border border-amber-200"
                  : "text-white bg-amber-600"
              }`}
            >
              {state.message}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-amber-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                  placeholder=""
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-amber-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                  placeholder=""
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-amber-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-amber-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="w-full px-4 py-3 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                placeholder="(+234) 080 0000 0000"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-amber-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-amber-600">
                Must be at least 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className={`w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${
                  isPending ? "opacity-80 cursor-not-allowed" : "hover:shadow-lg"
                }`}
              >
                {isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    CREATING ACCOUNT...
                  </span>
                ) : 'REGISTER'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}