import { notFound } from "next/navigation";
import Image from "next/image";
import { Room } from "@/types/room";
import Link from "next/link";

async function getRoom(id: string): Promise<Room | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rooms/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function RoomDetailsPage({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) return notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="inline-block mb-6 text-amber-600 hover:underline">
        ← Back to Homepage
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {Array.isArray(room.images) && room.images.length > 0 && (
          <div className="relative w-full h-64">
            <Image
              src={room.images[0]}
              alt={room.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
          <p className="mt-2 text-lg text-gray-700">
            Price: <span className="font-semibold">${room.price}</span> / night
          </p>
          <p className="mt-1">
            Status:{" "}
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                room.status === "available"
                  ? "bg-green-100 text-green-800"
                  : room.status === "occupied"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {room.status}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-700">{room.description || "No description available."}</p>
      </div>

      {Array.isArray(room.images) && room.images.length > 1 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {room.images.slice(1).map((img, index) => (
              <div key={index} className="relative h-40">
                <Image
                  src={img}
                  alt={`Room image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href={`/book/${room._id}`}
          className="block w-full md:w-auto text-center bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          Book This Room
        </Link>
      </div>
    </div>
  );
}
