// types/room.d.ts
export interface Room {
  _id: string;               // MongoDB ID
  name: string;
  description: string;       // Detailed room description
  price: number;
  image: string;             // URL or path (Cloudinary/public)
  images?: string[];         // Additional images
  amenities: Amenity[];      // Specific amenities
  capacity: number;          // Max guests
  beds: number;
  roomSize: string;          // e.g., "450 sq ft"
  isFeatured?: boolean;      // For homepage display
  rating?: number;           // 1-5
  reviews?: Review[];        // User reviews
  available?: boolean;       // Booking status
}

// Supporting types
export type Amenity = 
  | "WiFi"
  | "Pool"
  | "Gym"
  | "Breakfast"
  | "Air Conditioning"
  | "Workspace"
  | "TV"
  | "Kitchen"
  | "Parking"
  | "Balcony"
  | string;                  // Allows custom amenities

export interface Review {
  userId: string;            // Reference to User
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}