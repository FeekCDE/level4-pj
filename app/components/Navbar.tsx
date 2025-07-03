"use client"

import Link from 'next/link';
import { useAuth } from '@/authContext';

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-amber-600">
          LuxuryStays
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link href="/search" className="hover:text-amber-600 transition">
            Browse
          </Link>
          <Link href="/dashboard" className="hover:text-amber-600 transition">
            Dashboard
          </Link>
          {isLoggedIn ? (
            <Link href="/bookings" className="hover:text-amber-600 transition">
              My Bookings
            </Link>
          ) : null}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm">Hi, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm hover:text-amber-600 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}