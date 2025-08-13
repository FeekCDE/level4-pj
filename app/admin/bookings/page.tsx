
import dbConnect from '@/dbConnect';
import Booking from '@/models/booking.model';
import BookingTable from '../components/BookingTable';

export default async function BookingsPage() {
  await dbConnect();

  const bookings = await Booking.find()
    .populate('room', 'name') // ensure room is populated
    .lean();

  const formattedBookings = bookings.map((b) => ({
    _id: (b._id as string | { toString(): string }).toString(),
    guestName: b.guestName,
    guestEmail: b.guestEmail,
    roomName: b.room.name,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    status: b.status,
    totalPrice: b.totalPrice,
  }));

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>
        <BookingTable initialBookings={formattedBookings} />
      </main>
    </div>
  );
}
