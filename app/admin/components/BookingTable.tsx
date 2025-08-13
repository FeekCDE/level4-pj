'use client';

import { Booking } from '@/types/booking';
import { useState } from 'react';

interface BookingTableProps {
  initialBookings: Booking[];
}

export default function BookingTable({ initialBookings }: BookingTableProps) {
  const [bookings, setBookings] = useState(initialBookings);

  const updateStatus = async (id: string, status: Booking['status']) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update booking');
      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: updated.status } : b))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Guest</th>
            <th className="p-3 text-left">Room</th>
            <th className="p-3 text-left">Check In</th>
            <th className="p-3 text-left">Check Out</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="border-t">
              <td className="p-3">
                <div className="font-medium">{b.guestName}</div>
                <div className="text-xs text-gray-500">{b.guestEmail}</div>
              </td>
              <td className="p-3">{b.roomName}</td>
              <td className="p-3">{new Date(b.checkIn).toLocaleDateString()}</td>
              <td className="p-3">{new Date(b.checkOut).toLocaleDateString()}</td>
              <td className="p-3">
                <select
                  value={b.status}
                  onChange={(e) => updateStatus(b._id, e.target.value as Booking['status'])}
                  className="border px-2 py-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="p-3">${b.totalPrice}</td>
              <td className="p-3 text-right">
                <button
                  onClick={() => deleteBooking(b._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center p-6 text-gray-500">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
