// route.ts

import { authMiddleware } from '@/authentication';
import dbConnect from '@/dbConnect';
import bookingModel from '@/models/booking.model';
import roomModel from '@/models/room.model';
import { IUser } from '@/models/user.model';
import { NextResponse } from 'next/server';

function calculateTotalPrice(pricePerNight: number, checkIn: string, checkOut: string): number {
  const nights = (new Date(checkOut).getTime() - new Date(checkIn).getTime());
  return (nights / (1000 * 60 * 60 * 24)) * pricePerNight;
}

const handler = async (request: Request, user: IUser) => {
  try {
    await dbConnect();
    const { roomId, checkIn, checkOut, guests } = await request.json();

    const room = await roomModel.findById(roomId);
    if (!room || room.status !== 'available') {
      return NextResponse.json(
        { success: false, message: 'Room not available' },
        { status: 400 }
      );
    }

    const overlappingBooking = await bookingModel.findOne({
      room: roomId,
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
      ],
    });

    if (overlappingBooking) {
      return NextResponse.json(
        { success: false, message: 'Room already booked for these dates' },
        { status: 400 }
      );
    }

    const booking = await bookingModel.create({
      user: user.id,
      room: roomId,
      checkIn,
      checkOut,
      guests,
      totalPrice: calculateTotalPrice(room.price, checkIn, checkOut),
      status: 'confirmed',
    });

    await roomModel.findByIdAndUpdate(roomId, { status: 'booked' });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Booking failed' },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  const handlerWithAuth = await authMiddleware(handler, ['user']);
  return handlerWithAuth(request);
};
