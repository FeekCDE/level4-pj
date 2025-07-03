import Image from 'next/image';
import type { Room } from '@/types/room';

interface RoomCardProps {
  room: Room;
  onBookNow: () => void;
  isLoggedIn: boolean;
}

export default function RoomCard({ room, onBookNow, isLoggedIn }: RoomCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={room.image}
          alt={room.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{room.name}</h3>
          <p className="font-semibold text-amber-600">
            ${room.price}<span className="text-gray-500 text-sm">/night</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <button
          onClick={onBookNow}
          className={`w-full py-2 px-4 rounded-lg font-medium ${
            isLoggedIn
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-gray-200 text-gray-700 cursor-not-allowed'
          }`}
        >
          {isLoggedIn ? 'Book Now' : 'Login to Book'}
        </button>
      </div>
    </div>
  );
}