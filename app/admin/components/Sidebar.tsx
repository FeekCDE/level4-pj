"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/rooms', label: 'Manage Rooms', icon: '🛏️' },
    { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { href: '/admin/guests', label: 'Guests', icon: '👥' },
  ];

  return (
    <div className="w-64 bg-white shadow">
      <div className="p-4 space-y-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-amber-100 text-amber-700'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}