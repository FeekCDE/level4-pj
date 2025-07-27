import mongoose, { Document, Schema } from 'mongoose';
import { IRoom } from './room.model';
import { IUser } from './user.model';

// TypeScript interface
export interface IBooking extends Document {
  user: mongoose.Types.ObjectId | IUser;
  room: mongoose.Types.ObjectId | IRoom;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Booking must be for a room'],
    },
    checkIn: {
      type: Date,
      required: [true, 'Please provide check-in date'],
      validate: {
        validator: function (this: IBooking, value: Date) {
          return value >= new Date();
        },
        message: 'Check-in date must be in the future',
      },
    },
    checkOut: {
      type: Date,
      required: [true, 'Please provide check-out date'],
      validate: {
        validator: function (this: IBooking, value: Date) {
          return value > this.checkIn;
        },
        message: 'Check-out date must be after check-in date',
      },
    },
    guests: {
      type: Number,
      required: [true, 'Please specify number of guests'],
      min: [1, 'Minimum 1 guest required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Booking must have a total price'],
      min: [0, 'Price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_transfer', 'cash'],
    },
    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
BookingSchema.index({ user: 1 });
BookingSchema.index({ room: 1 });
BookingSchema.index({ checkIn: 1 });
BookingSchema.index({ checkOut: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });

// Prevent duplicate bookings for the same room and dates
BookingSchema.index(
  { room: 1, checkIn: 1, checkOut: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);

// Virtual populate for reviews
BookingSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'booking',
  localField: '_id',
});

// Update room status when booking is created
BookingSchema.post('save', async function (doc: IBooking) {
  await mongoose.model('Room').findByIdAndUpdate(doc.room, {
    status: 'occupied',
  });
});

// Update room status when booking is cancelled or completed
BookingSchema.post(/^findOneAnd/, async function (doc: IBooking) {
  if (doc.status === 'cancelled' || doc.status === 'completed') {
    await mongoose.model('Room').findByIdAndUpdate(doc.room, {
      status: 'available',
    });
  }
});

export default mongoose.model<IBooking>('Booking', BookingSchema);