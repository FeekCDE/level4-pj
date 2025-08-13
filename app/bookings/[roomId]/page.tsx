"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IRoom } from "@/models/room.model";
import { IBookingRequest, IBookingResponse } from "@/types/booking.d";

export default function BookingPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();

  const [room, setRoom] = useState<IRoom | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch room details
  useEffect(() => {
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        if (!res.ok) throw new Error("Failed to fetch room");
        const data: { data: IRoom } = await res.json();
        setRoom(data.data);
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage("Failed to load room details");
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !room) {
      setMessage("Please select check-in and check-out dates.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const bookingData: IBookingRequest = {
        roomId: String(roomId),
        checkIn,
        checkOut,
        guests,
      };

      const res = await fetch(`/api/bookings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result: IBookingResponse = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Booking failed");
      }

      setMessage("✅ Booking confirmed!");

      sessionStorage.setItem(
        "bookingDetails",
        JSON.stringify({
          roomName: room.name,
          checkIn,
          checkOut,
          guests,
          price: room.price,
        })
      );

      setTimeout(() => router.push("/bookings/confirmation"), 1500);
    } catch (err: unknown) {
      setMessage(`❌ ${err instanceof Error ? err.message : "Booking failed"}`);
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return (
      <p className="text-center py-10 text-gray-500">Loading room details...</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Room Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <Image
          src={room.images?.[0] || "/placeholder.jpg"}
          alt={room.name}
          width={800}
          height={400}
          className="w-full h-64 object-cover"
          priority={false}
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
          <p className="text-gray-600 mt-2">{room.description}</p>
          <p className="mt-4 text-lg font-semibold text-blue-600">
            ${room.price} / night
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Book Your Stay</h2>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1">Check-In Date</label>
            <DatePicker
              selected={checkIn}
              onChange={(date: Date | null) => setCheckIn(date)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="w-full border p-2 rounded focus:ring focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Check-Out Date</label>
            <DatePicker
              selected={checkOut}
              onChange={(date: Date | null) => setCheckOut(date)}
              minDate={checkIn || new Date()}
              dateFormat="yyyy-MM-dd"
              className="w-full border p-2 rounded focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Number of Guests</label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full border p-2 rounded focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleBooking}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Booking..." : "Book Now"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
