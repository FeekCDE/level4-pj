"use client";

import { useAuth } from '@/authContext';
import Link from 'next/link';

export default function AdminNavbar() {
  const { logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/admin" className="text-xl font-bold text-amber-600">
          HotelAdmin
        </Link>
        <button
          onClick={logout}
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}