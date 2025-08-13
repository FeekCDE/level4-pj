import { NextResponse } from 'next/server';
import Booking from '@/models/booking.model';
import dbConnect from '@/dbConnect';

export async function GET() {
  await dbConnect()

  const bookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name')
    .populate('room', 'name');

  return NextResponse.json(bookings);
}
