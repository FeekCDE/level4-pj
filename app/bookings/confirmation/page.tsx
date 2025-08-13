"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface BookingDetails {
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  price: number;
}

export default function BookingConfirmationPage() {
  const router = useRouter();
  const [details, setDetails] = useState<BookingDetails | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const storedDetails = sessionStorage.getItem("bookingDetails");
    if (storedDetails) {
      const parsedDetails = JSON.parse(storedDetails);
      // Ensure checkIn and checkOut are Date objects
      const bookingDetails: BookingDetails = {
        ...parsedDetails,
        checkIn: new Date(parsedDetails.checkIn),
        checkOut: new Date(parsedDetails.checkOut),
      };
      setDetails(bookingDetails);
      sessionStorage.removeItem("bookingDetails");
      setTimeout(() => setShowContent(true), 100); // Added small delay
    } else {
      router.push("/");
    }
  }, [router]);

  if (!details) {
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div
        className={`max-w-lg w-full p-8 bg-white shadow-xl rounded-2xl transform transition-all duration-500 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="h-20 w-20 text-green-500 animate-bounce" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-green-600 text-center">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Thank you for booking with us. Your stay is confirmed.
        </p>

        {/* Booking Details */}
        <div className="mt-6 border-t pt-4 space-y-2 text-gray-700">
          <p>
            <strong>🏨 Room:</strong> {details.roomName}
          </p>
          <p>
            <strong>📅 Check-in:</strong>{" "}
            {details.checkIn.toLocaleDateString()}
          </p>
          <p>
            <strong>📅 Check-out:</strong>{" "}
            {details.checkOut.toLocaleDateString()}
          </p>
          <p>
            <strong>👥 Guests:</strong> {details.guests}
          </p>
          <p>
            <strong>💰 Total Price:</strong> $
            {(
              details.price *
              ((details.checkOut.getTime() - details.checkIn.getTime()) /
                (1000 * 60 * 60 * 24))
            ).toFixed(2)}
          </p>
        </div>

        {/* Back Home Button */}
        <button
          onClick={() => router.push("/")}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}