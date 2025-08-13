import Image from "next/image";
import Link from "next/link";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { getCurrentUser } from "@/authentication";
import Room, { IRoom } from "@/models/room.model";
import dbConnect from "@/dbConnect";

export const dynamic = "force-dynamic";

async function getFeaturedRooms(): Promise<IRoom[]> {
  await dbConnect(); 
  return Room.find({ isFeatured: true }).limit(6).lean().exec() as unknown as Promise<IRoom[]>;
}

export default async function Home() {
  const featuredRooms = await getFeaturedRooms();
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen">
      <Navbar user={user} />
      <Hero />

      {/* Search Bar Section */}
      <section className="container mx-auto px-4 py-12 -mt-16 relative z-30 bg-white rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Check In</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Check Out</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-end">
                <Link
                  href={`/search`}
                  className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Search
                </Link>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-2">Featured Rooms</h2>
        <p className="text-gray-600 mb-8">
          Curated selection of our finest accommodations
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <div
              key={String(room._id)}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={room.images[0]}
                  alt={room.name}
                  width={500}
                  height={300}
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{room.name}</h3>
                  <p className="text-lg font-bold text-amber-600">
                    ${room.price}
                    <span className="text-sm font-normal text-gray-500">/night</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/bookings/${room._id}`}
                  className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for an unforgettable stay?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Browse through our exclusive collection of luxury rooms and find your perfect escape.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/search"
              className="bg-white hover:bg-gray-100 text-amber-600 border border-amber-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Browse Rooms
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
