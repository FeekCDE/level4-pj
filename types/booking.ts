export interface Booking {
  [x: string]: any;
  _id: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
}
