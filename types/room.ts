// types/room.d.ts
export interface Room {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  amenities: Amenity[];
  capacity: number;
  beds: number;
  roomSize: string;
  isFeatured?: boolean;
  rating?: number;
  reviews?: Review[];
  status: Status[]|string;
}

export type Status = "available" | "occupied" | "maintainance" | string;

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
  | string;

export interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}
