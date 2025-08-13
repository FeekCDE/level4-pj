import Link from "next/link";
import Image from "next/image"; // Replace img with Next.js Image
import dbConnect from "@/dbConnect";
import Room from "@/models/room.model";


export default async function BookingsPage() {
  await dbConnect();

  // Fetch all rooms with proper typing
  const rooms = await Room.find().lean();

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Book a Room</h1>

      {rooms.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg shadow-md">
          <p className="text-lg text-gray-600">No rooms available at the moment.</p>
          <p className="text-sm text-gray-500 mt-2">Please check back later.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room._id.toString()}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <Image
                src={room.images?.[0] || "/placeholder.jpg"}
                alt={room.name}
                width={400}
                height={192}
                className="h-48 w-full object-cover"
                priority={false}
              />
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
                <p className="text-gray-600 mb-4 flex-1">{room.description}</p>
                <p className="text-blue-600 font-bold mb-4">
                  ${room.price} / night
                </p>
                <Link
                  href={`/bookings/${room._id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}