"use client";

import { useState, useEffect } from 'react';
import { Room } from '@/types/room';
import AddRoomModal from '../components/addRoomModal';
import RoomTable from '../components/Roomtable';

export default function ManageRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/admin/rooms');
        if (!res.ok) throw new Error('Failed to fetch rooms');
        const data: Room[] = await res.json();
        setRooms(data);
      } catch (error) {
        console.error('Error loading rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleAddRoom = async (newRoom: Room) => {
    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom),
      });
      if (!res.ok) throw new Error('Failed to add room');
      const addedRoom: Room = await res.json();
      setRooms([...rooms, addedRoom]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Rooms</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        >
          Add Room
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading rooms...</p>
      ) : (
        <RoomTable rooms={rooms} setRooms={setRooms} />
      )}

      <AddRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddRoom}
      />
    </div>
  );
}
