import mongoose, { Document, Schema } from 'mongoose';
import { IRoom } from './room.model';
import { IUser } from './user.model';

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
      required: true,
      validate: {
        validator: function (this: IBooking, value: Date) {
          return value >= new Date();
        },
        message: 'Check-in date must be in the future',
      },
    },
    checkOut: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IBooking, value: Date) {
          return value > this.checkIn;
        },
        message: 'Check-out must be after check-in',
      },
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
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
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
BookingSchema.index({ user: 1 });
BookingSchema.index({ room: 1 });
BookingSchema.index({ checkIn: 1 });
BookingSchema.index({ checkOut: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ paymentStatus: 1 });

// Prevent double booking
BookingSchema.index(
  { room: 1, checkIn: 1, checkOut: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);

// Virtual populate
BookingSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'booking',
  localField: '_id',
});

// Post hooks for room status
BookingSchema.post('save', async function (doc: IBooking) {
  await mongoose.model('Room').findByIdAndUpdate(doc.room, {
    status: 'occupied',
  });
});

BookingSchema.post(/^findOneAnd/, async function (doc: IBooking) {
  if (doc.status === 'cancelled' || doc.status === 'completed') {
    await mongoose.model('Room').findByIdAndUpdate(doc.room, {
      status: 'available',
    });
  }
});

const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
