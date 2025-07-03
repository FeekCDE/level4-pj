import { Room } from "@/types/room";
import Image from "next/image";
import Link from "next/link";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Mock data fetch (replace with real API call)
async function getFeaturedRooms(): Promise<Room[]> {
  // In production, fetch from your MongoDB API
  return [
    {
      _id: "1",
      name: "Luxury Ocean Suite",
      price: 299,
      image: "/images/room1.jpg",
      amenities: ["WiFi", "Pool", "Breakfast"],
      description: "",
      capacity: 0,
      beds: 0,
      roomSize: ""
    },
    {
      _id: "2",
      name: "Executive City View",
      price: 199,
      image: "/images/room2.jpg",
      amenities: ["WiFi", "Gym", "Workspace"],
      description: "",
      capacity: 0,
      beds: 0,
      roomSize: ""
    },
    {
      _id: "3",
      name: "Cozy Mountain Retreat",
      price: 159,
      image: "/images/room3.jpg",
      amenities: ["WiFi", "Fireplace", "Balcony"],
      description: "",
      capacity: 0,
      beds: 0,
      roomSize: ""
    },
  ];
}


export default async function Home() {
  const featuredRooms = await getFeaturedRooms();

  return (
    <main className="min-h-screen">
      <Navbar/>
      <Hero/>

      {/* Search Bar Section */}
      <section className="container mx-auto px-4 py-12 -mt-16 relative z-30 bg-white rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              placeholder="Where are you going?"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
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
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-lg font-medium transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-2">Featured Rooms</h2>
        <p className="text-gray-600 mb-8">
          Curated selection of our finest accommodations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room) => (
            <div key={room._id} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{room.name}</h3>
                  <p className="text-lg font-bold text-amber-600">
                    ${room.price}<span className="text-sm font-normal text-gray-500">/night</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity) => (
                    <span key={amenity} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/rooms/${room._id}`}
                  className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-amber-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for an unforgettable stay?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sign up now to book your dream vacation with exclusive member benefits
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/search"
              className="bg-white hover:bg-gray-100 text-amber-600 border border-amber-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Browse Rooms
            </Link>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}