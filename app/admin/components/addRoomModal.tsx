"use client";

import { useState } from 'react';
import { Room } from '@/types/room';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Room) => Promise<void>;
}

const defaultRoomData: Omit<Room, '_id'> = {
  name: '',
  description: '',
  price: 0,
  capacity: 1,
  beds: 1,
  amenities: [],
  roomSize: '',
  image: '',
  status: 'available',
};

export default function AddRoomModal({ isOpen, onClose, onSave }: AddRoomModalProps) {
  const [roomData, setRoomData] = useState<Omit<Room, '_id'>>(defaultRoomData);
  const [isLoading, setIsLoading] = useState(false);

  const amenitiesOptions: Room['amenities'][number][] = [
    'WiFi',
    'Pool',
    'Gym',
    'Breakfast',
    'Air Conditioning',
    'TV',
    'Workspace',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave({
        ...roomData,
        _id: '', // temp placeholder if backend assigns this
      });
      setRoomData(defaultRoomData);
      onClose();
    } catch (error) {
      console.error('Error saving room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setRoomData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="inset-0 bg-amber-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-amber-800">Add New Room</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Room Name</label>
              <input
                type="text"
                value={roomData.name}
                onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Description</label>
              <textarea
                value={roomData.description}
                onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  value={roomData.price}
                  onChange={(e) => setRoomData({ ...roomData, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={roomData.capacity}
                  onChange={(e) => setRoomData({ ...roomData, capacity: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Beds</label>
                <input
                  type="number"
                  value={roomData.beds}
                  onChange={(e) => setRoomData({ ...roomData, beds: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Room Size (sq ft)</label>
                <input
                  type="text"
                  value={roomData.roomSize}
                  onChange={(e) => setRoomData({ ...roomData, roomSize: e.target.value })}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Image URL</label>
              <input
                type="text"
                value={roomData.image}
                onChange={(e) => setRoomData({ ...roomData, image: e.target.value })}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                placeholder="https://example.com/room.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesOptions.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={roomData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="h-4 w-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Status</label>
              <select
                value={roomData.status}
                onChange={(e) => setRoomData({ ...roomData, status: e.target.value as Room['status'] })}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
