"use client";

import { useState } from "react";
import { Room } from "@/types/room";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Room) => Promise<void>;
}

const defaultRoomData: Omit<Room, "_id"> = {
  name: "",
  description: "",
  price: 0,
  capacity: 1,
  beds: 1,
  amenities: [],
  roomSize: "",
  images: [],
  status: "available"
};

export default function AddRoomModal({ isOpen, onClose, onSave }: AddRoomModalProps) {
  const [roomData, setRoomData] = useState<Omit<Room, "_id">>(defaultRoomData);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const amenitiesOptions: Room["amenities"][number][] = [
    "WiFi",
    "Pool",
    "Gym",
    "Breakfast",
    "Air Conditioning",
    "TV",
    "Workspace",
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadingImage(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Image upload failed");
      }

      setRoomData((prev) => ({
        ...prev,
        image: data.url,
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
      setFormError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null); // clear previous error

    try {
      await onSave({
        ...roomData,
        _id: undefined
      });
      setRoomData(defaultRoomData);
      onClose();
    } catch (error: any) {
      console.error("Error saving room:", error);
      setFormError(error?.message || "Failed to save room. Please try again.");
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-amber-800">Add New Room</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {formError}
              </div>
            )}

            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Room Name</label>
              <input
                type="text"
                value={roomData.name}
                onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Description</label>
              <textarea
                value={roomData.description}
                onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg"
                rows={3}
                required
              />
            </div>

            {/* Price & Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Price (₦)</label>
                <input
                  type="number"
                  value={roomData.price}
                  onChange={(e) => setRoomData({ ...roomData, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg"
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
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg"
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Beds & Room Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">Beds</label>
                <input
                  type="number"
                  value={roomData.beds}
                  onChange={(e) => setRoomData({ ...roomData, beds: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg"
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
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-amber-300 rounded-lg"
              />
              {uploadingImage && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
              {roomData.images && (
                <img
                  src={roomData.images[0]}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesOptions.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={roomData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="h-4 w-4 text-amber-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-amber-700 mb-1">Status</label>
              <select
                value={roomData.status}
                onChange={(e) =>
                  setRoomData({ ...roomData, status: e.target.value as Room["status"] })
                }
                className="w-full px-4 py-2 border border-amber-300 rounded-lg"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Actions */}
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
                disabled={isLoading || uploadingImage}
                className={`px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg ${
                  isLoading || uploadingImage
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:from-amber-600 hover:to-amber-700"
                }`}
              >
                {isLoading ? "Saving..." : "Save Room"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
