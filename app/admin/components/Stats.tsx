'use client';

import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function AdminStats() {
  const { data, error, isLoading } = useSWR('/api/admin/stats', fetcher);

  if (isLoading) return <p>Loading stats...</p>;
  if (error) return <p>Error loading stats</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard title="Total Bookings" value={data.totalBookings} />
      <StatCard title="Active Guests" value={data.totalGuests} />
      <StatCard title="Total Revenue" value={`$${data.totalRevenue}`} />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow text-center">
      <h2 className="text-sm font-semibold text-gray-500">{title}</h2>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}
