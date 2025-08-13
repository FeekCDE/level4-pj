'use client';

import useSWR from 'swr';
import axios from 'axios';
import Link from 'next/link';
import { Booking } from '@/types/booking';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function RecentBookings() {
  const { data, error, isLoading } = useSWR('/api/admin/recent-bookings', fetcher);

  if (isLoading) return <p>Loading recent bookings...</p>;
  if (error) return <p>Error loading recent bookings</p>;

  // Adjust for API shape: if API returns { data: bookings[] }
  const bookings: Booking[] = data?.data ?? data ?? [];

  if (bookings.length === 0) {
    return <p className="text-gray-500">No recent bookings found</p>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="flex justify-between items-center border-b pb-2 text-sm"
          >
            <div>
              <p><span className="font-semibold">User:</span> {booking.user?.name ?? 'Unknown'}</p>
              <p><span className="font-semibold">Room:</span> {booking.room?.name ?? 'Unknown'}</p>
              <p><span className="font-semibold">Check-in:</span> {new Date(booking.checkIn).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className={`font-bold ${booking.status === 'cancelled' ? 'text-red-500' : 'text-green-600'}`}>
                {booking.status}
              </p>
              <Link
                href={`/admin/bookings/${booking._id}`}
                className="text-amber-600 text-xs hover:underline"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
