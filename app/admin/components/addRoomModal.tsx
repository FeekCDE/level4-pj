"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import type { Room } from "@/types/room";

type ImageItem = { url: string; public_id?: string };

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Omit<Room, "_id">) => Promise<void>;
}

interface UploadResponse {
  url: string;
  public_id?: string;
  error?: string;
}

const initialForm = {
  name: "",
  description: "",
  price: 0,
  capacity: 1,
  beds: 1,
  amenities: [] as Room["amenities"],
  roomSize: "",
  images: [] as ImageItem[],
  status: "available" as Room["status"],
};

export default function AddRoomModal({ isOpen, onClose, onSave }: AddRoomModalProps) {
  const [form, setForm] = useState(() => ({ ...initialForm }));
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const amenitiesOptions: Room["amenities"][number][] = [
    "WiFi",
    "Pool",
    "Gym",
    "Breakfast",
    "Air Conditioning",
    "TV",
    "Workspace",
    "Kitchen",
    "Parking",
    "Balcony",
  ];

  async function uploadFile(file: File): Promise<ImageItem> {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data: UploadResponse = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Upload failed");
    }

    return { url: data.url, public_id: data.public_id };
  }

  const handleImageUpload = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setIsUploading(true);
    try {
      const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (fileArray.length === 0) {
        setError("Please select image files only.");
        return;
      }

      const uploads = await Promise.all(fileArray.map((f) => uploadFile(f)));
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploads],
      }));
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

 // Drag handlers
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Remove previewed image (and optionally delete from Cloudinary if you implement the API)
  const removeImage = async (index: number) => {
    const img = form.images[index];
    // Optionally: call your server to delete from cloud using public_id
    if (img.public_id) await fetch('/api/upload', { method: 'DELETE', body: JSON.stringify({ public_id: img.public_id }) })

    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleAmenity = (amenity: Room["amenities"][number]) => {
    setForm((prev) => {
      const included = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: included ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity],
      };
    });
  };

  // Validate + save -> convert ImageItem[] to string[] for backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    // additional validation (example)
    if (!form.name.trim()) {
      setError("Room name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: Omit<Room, "_id"> = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        capacity: Number(form.capacity),
        beds: Number(form.beds),
        amenities: form.amenities,
        roomSize: form.roomSize,
        images: form.images.map((i) => i.url),
        status: form.status,
      };

      // wait for the parent's onSave to complete (do not close early)
      await onSave(payload);

      // success UI
      setForm({ ...initialForm });
      onClose();
    }catch (err: unknown) {
  console.error("Save error:", err);
  setError(err instanceof Error ? err.message : "Failed to save room.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
   {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => {
          if (!isUploading && !isSaving) onClose();
        }}
      />

      {/* modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-amber-800">Add New Room</h3>
            <button
              type="button"
              aria-label="Close dialog"
              onClick={() => {
                if (!isUploading && !isSaving) onClose();
              }}
              className="text-gray-600 hover:text-gray-800 rounded"
            >
              ✕
            </button>
          </div>

          {error && <div className="mb-4 text-sm text-red-700 bg-red-100 p-2 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* name & desc */}
            <div>
              <label className="block text-sm font-medium mb-1">Room Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            {/* price / capacity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Capacity</label>
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* beds / roomSize */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Beds</label>
                <input
                  type="number"
                  min={1}
                  value={form.beds}
                  onChange={(e) => setForm((p) => ({ ...p, beds: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Room Size</label>
                <input
                  value={form.roomSize}
                  onChange={(e) => setForm((p) => ({ ...p, roomSize: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* dropzone */}
            <div>
              <label className="block text-sm font-medium mb-2">Images</label>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fileInputRef.current?.click();
                }}
                className={`w-full border-2 border-dashed rounded p-4 text-center cursor-pointer transition ${
                  dragOver ? "border-amber-500 bg-amber-50" : "border-amber-200 bg-white"
                }`}
                aria-label="Upload room images"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
                <div className="text-sm text-gray-600">
                  {isUploading ? "Uploading..." : "Click or drag & drop images here (multiple allowed)"}
                </div>
              </div>
            </div>
      {/* Updated image preview section */}
      {form.images.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {form.images.map((img, idx) => (
            <div key={img.url + idx} className="relative rounded overflow-hidden">
              <Image
                src={img.url}
                alt={`Preview ${idx + 1}`}
                width={200}
                height={112}
                className="object-cover w-full h-28 block"
                priority={false}
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2 py-0.5 text-xs opacity-0 hover:opacity-100 transition"
                aria-label={`Remove image ${idx + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* amenities */}
            <div>
              <label className="block text-sm font-medium mb-2">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {amenitiesOptions.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(a)}
                      onChange={() => toggleAmenity(a)}
                    />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Room["status"] }))}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* actions */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  if (!isUploading && !isSaving) onClose();
                }}
                className="px-4 py-2 border rounded"
                disabled={isUploading || isSaving}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isUploading || isSaving}
                className={`px-4 py-2 rounded text-white bg-amber-600 hover:bg-amber-700 ${
                  isUploading || isSaving ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isSaving ? "Saving..." : "Save Room"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}