"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleSignUp } from "../lib/authentication";

const initialState = {
  success: false,
  message: "",
};

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(
    handleSignUp,
    initialState
  );
  const router = useRouter();

 useEffect(() => {
  if (state.success) {
    router.push("/login");
  }
}, [state.success, router]);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="w-full max-w-xs mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light tracking-wide text-gray-800 mb-1">CREATE ACCOUNT</h1>
          <div className="h-px w-16 bg-gray-300 mx-auto"></div>
          <p className="mt-4 text-xs text-gray-500 tracking-wide">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-gray-700 hover:text-gray-900 underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {state?.message && (
          <div
            className={`mb-6 p-3 text-sm text-center border ${
              state.success
                ? "text-gray-700 bg-gray-100 border-gray-300"
                : "text-gray-700 bg-gray-100 border-gray-300"
            }`}
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 bg-transparent outline-none transition duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 bg-transparent outline-none transition duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 bg-transparent outline-none transition duration-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 6 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-500 bg-transparent outline-none transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-normal tracking-wide focus:outline-none transition duration-200 ${
              isPending ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isPending ? "CREATING ACCOUNT..." : "REGISTER"}
          </button>
        </form>
      </div>
    </div>
  );
}

