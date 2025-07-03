export interface User {
  _id: string;                   // MongoDB ID
  name: string;
  email: string;
  password?: string;             // Only for client-side forms (never stored in state)
  avatar?: string;              // URL to profile image (Cloudinary)
  role: 'user' | 'admin';       // User permissions
  bookings: BookingRef[];       // Array of booking references
  favorites: string[];          // Array of room IDs
  createdAt: Date;
  updatedAt: Date;
}

// Sub-types
export interface BookingRef {
  bookingId: string;            // Reference to Booking document
  roomId: string;              // Reference to Room
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'cancelled' | 'completed';
}

// For registration forms
export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;     // Client-side only
}

// For login forms
export interface LoginUser {
  email: string;
  password: string;
}

// API Responses
export interface AuthResponse {
  user: Omit<User, 'password'>; // Never return password
  token: string;               // JWT token
}

// User profile updates
export interface UpdateUser {
  name?: string;
  email?: string;
  avatar?: string;
}