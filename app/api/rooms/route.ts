import { authMiddleware } from '@/authentication';
import dbConnect from '@/dbConnect';
import roomModel from '@/models/room.model';
import { NextResponse } from 'next/server';


interface RoomQuery {
  status?: string;
  price?: {
    $gte?: number;
    $lte?: number;
  };
}



// GET all rooms
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const query: RoomQuery = {};
    if (status) query.status = status;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const rooms = await roomModel.find(query);
    return NextResponse.json({ success: true, data: rooms }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}


// POST create new room (admin only)
export const POST = async (request: Request) => {
  const handlerWithAuth = await authMiddleware(async (request: Request) => {
    try {
      await dbConnect();

      const roomData = await request.json();
      const newRoom = await roomModel.create(roomData);

      return NextResponse.json({ success: true, data: newRoom }, {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error creating room:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to create room' },
        { status: 500 }
      );
    }
  });

  return handlerWithAuth(request);
};
