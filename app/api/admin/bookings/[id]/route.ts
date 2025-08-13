import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/dbConnect';
import Booking from '@/models/booking.model';

// This matches Next.js's type generation
type Params = { params: Promise<{ id: string }> };

// ✅ Update booking
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params; // destructure after awaiting
  await dbConnect();

  const { status, paymentStatus } = await req.json();

  try {
    const updated = await Booking.findByIdAndUpdate(
      id,
      { status, paymentStatus },
      { new: true }
    )
      .populate({ path: 'room', select: 'name status price' })
      .populate({ path: 'user', select: 'name email' });

    if (!updated) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update booking', error }, { status: 500 });
  }
}

// ✅ Get booking by ID
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await dbConnect();

  try {
    const booking = await Booking.findById(id)
      .populate({ path: 'room', select: 'name status price' })
      .populate({ path: 'user', select: 'name email' });

    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch booking', error }, { status: 500 });
  }
}

// ✅ Delete booking
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await dbConnect();

  try {
    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete booking', error }, { status: 500 });
  }
}
