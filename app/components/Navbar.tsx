import { handleLogOut } from '@/authentication';
import Link from 'next/link';

interface NavbarProps {
  user: {
    firstName: string;
    role: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const isLoggedIn = !!user;

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
          {isLoggedIn && (
            <>
              <Link href="/dashboard" className="hover:text-amber-600 transition">
                Dashboard
              </Link>
              <Link href="/bookings" className="hover:text-amber-600 transition">
                My Bookings
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className="hover:text-amber-600 transition">
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm">Hi, {user.firstName}</span>
              {/* You could implement logout via a POST server action or redirect */}
              <form action={handleLogOut} method="POST">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm hover:text-amber-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
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
