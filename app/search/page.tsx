"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/authContext';
import type { Room } from '@/types/room';
import SearchFilters from '../components/ui/SearchFilters';
import RoomCard from '../components/ui/RoomCard';

export default function BrowsePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    amenities: [] as string[],
  });

  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fetchRooms = async () => {
        try {
          setLoading(true);

          const query = new URLSearchParams();
          if (filters.minPrice) query.append('minPrice', filters.minPrice.toString());
          if (filters.maxPrice) query.append('maxPrice', filters.maxPrice.toString());
          filters.amenities.forEach(amenity => query.append('amenities', amenity));

          const response = await fetch(`/api/rooms?${query.toString()}`);
          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to fetch rooms');
          }

          setRooms(result.data);
        } catch (err) {
          setError('Failed to load rooms. Please try again later.');
          console.error('Fetch error:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchRooms();
    }, 500); // debounce delay

    return () => clearTimeout(timeout);
  }, [filters]);

  const handleBookNow = (roomId: string) => {
    if (!isLoggedIn) {
      router.push(`/login?from=/browse`);
      return;
    }
    router.push(`/book/${roomId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
        <p className="text-red-800 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Rooms</h1>
        <p className="text-gray-600">
          {rooms.length} rooms available for your stay
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters 
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {/* Rooms Grid */}
        <div className="lg:col-span-3">
          {rooms.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No rooms match your filters
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onBookNow={() => handleBookNow(room._id)}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
