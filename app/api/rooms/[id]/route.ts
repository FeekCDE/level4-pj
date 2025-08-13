import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '@/dbConnect';
import { NextResponse } from 'next/server';
import Room from '@/models/room.model';

// Force Node runtime (Cloudinary needs Node, not Edge)
export const runtime = 'nodejs';

// Helpful local type for the route context
type RouteContext = { params: Promise<{ id: string }> };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET single room
export async function GET(_req: Request, context: RouteContext) {
  await dbConnect();
  try {
    const { id } = await context.params; // <-- await params
    const room = await Room.findById(id).lean(); // plain object
    if (!room) {
      return NextResponse.json({ success: false, message: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: room }, { status: 200 });
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// UPDATE single room
export async function PUT(req: Request, context: RouteContext) {
  await dbConnect();
  try {
    const { id } = await context.params; // <-- await params
    const { name, price, status, images } = await req.json();

    if (!name || typeof price === 'undefined' || !status) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const room = await Room.findById(id);
    if (!room) {
      return NextResponse.json({ success: false, message: 'Room not found' }, { status: 404 });
    }

    // If client sent an images array, remove any old images that are no longer present
    if (Array.isArray(images)) {
      const oldImages = Array.isArray(room.images) ? room.images : [];
      const imagesToDelete = oldImages.filter(
        (oldImg: { public_id?: string }) =>
          oldImg?.public_id &&
          !images.some((newImg: { public_id?: string }) => newImg?.public_id === oldImg.public_id)
      );

      await Promise.all(
        imagesToDelete.map((img: { public_id: string; }) => cloudinary.uploader.destroy(String(img.public_id)))
      );
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { name, price, status, images: Array.isArray(images) ? images : room.images },
      { new: true }
    ).lean(); // chain lean() here

    return NextResponse.json({ success: true, data: updatedRoom }, { status: 200 });
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// DELETE single room
export async function DELETE(_req: Request, context: RouteContext) {
  await dbConnect();
  try {
    const { id } = await context.params; // <-- await params

    const room = await Room.findById(id).lean();
    if (!room) {
      return NextResponse.json({ success: false, message: 'Room not found' }, { status: 404 });
    }

    await Room.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Room deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
