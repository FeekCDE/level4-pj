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
        const res = await fetch("/api/rooms");
        const data = await res.json();
        setRooms(data.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

async function onSave(roomData: Omit<Room, "_id">) {
  const res = await fetch('/api/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(roomData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || 'Failed to save room');
  }

  return res.json();
}


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
        onSave={onSave}
      />
    </div>
  );
}
