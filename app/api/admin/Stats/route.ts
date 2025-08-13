import { NextResponse } from 'next/server';
import Booking from '@/models/booking.model';
import User from '@/models/user.model';
import dbConnect from '@/dbConnect';

export async function GET() {
  await dbConnect()

  const totalBookings = await Booking.countDocuments();
  const totalGuests = await User.countDocuments({ role: 'guest' });
  const bookings = await Booking.find({ paymentStatus: 'paid' });
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

  return NextResponse.json({
    totalBookings,
    totalGuests,
    totalRevenue,
  });
}
