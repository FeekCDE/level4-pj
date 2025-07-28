"use client";

import { Room } from '@/types/room';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

interface RoomTableProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

export default function RoomTable({ rooms, setRooms }: RoomTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Room>>({});

  const handleEdit = (room: Room) => {
    if (typeof room._id === 'string') {
      setEditingId(room._id);
    } else {
      setEditingId(null);
    }
    setEditData({
      name: room.name,
      price: room.price,
      status: room.status,
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Failed to update room");

      const updatedRoom: Room = await res.json();
      setRooms(prev => prev.map(room => room._id === id ? updatedRoom : room));
      setEditingId(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/rooms/${id}`, { method: 'DELETE' });
      setRooms(prev => prev.filter(room => room._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rooms.map((room) => (
            <tr key={room._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === room._id ? (
                  <input
                    type="text"
                    value={editData.name ?? ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{room.name}</div>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === room._id ? (
                  <input
                    type="number"
                    value={editData.price ?? ''}
                    onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                    className="border rounded px-2 py-1 w-20"
                  />
                ) : (
                  <div className="text-sm text-gray-900">${room.price}</div>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === room._id ? (
                  <select
                    value={editData.status ?? ''}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value as Room['status'] })}
                    className="border rounded px-2 py-1"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    room.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : room.status === 'occupied'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {room.status}
                  </span>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingId === room._id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => typeof room._id === 'string' ? handleUpdate(room._id) : undefined}
                      className="text-green-600 hover:text-green-900"
                      disabled={typeof room._id !== 'string'}
                    >
                      <FiCheck size={18} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-red-600 hover:text-red-900">
                      <FiX size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(room)} className="text-amber-600 hover:text-amber-900">
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => room._id ? handleDelete(room._id) : undefined}
                      className="text-red-600 hover:text-red-900"
                      disabled={!room._id}
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
