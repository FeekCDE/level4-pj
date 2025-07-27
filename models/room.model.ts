import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  description: string;
  price: number;
  capacity: number;
  beds: number;
  amenities: string[];
  roomSize: string;
  images: string[];
  status: 'available' | 'occupied' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
  isFeatured?: boolean;
  discount?: number;
  rating?: number;
}

const RoomSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a room name'],
      trim: true,
      maxlength: [100, 'Room name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price cannot be negative'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please add room capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    beds: {
      type: Number,
      required: [true, 'Please add number of beds'],
      min: [1, 'Must have at least 1 bed'],
    },
    amenities: {
      type: [String],
      required: [true, 'Please add at least one amenity'],
      enum: [
        'WiFi',
        'Pool',
        'Gym',
        'Breakfast',
        'Air Conditioning',
        'TV',
        'Workspace',
        'Kitchen',
        'Parking',
        'Balcony',
      ],
    },
    roomSize: {
      type: String,
      required: [true, 'Please add room size'],
    },
    images: {
      type: [String],
      required: [true, 'Please add at least one image'],
      validate: {
        validator: (images: string[]) => images.length > 0,
        message: 'Please add at least one image',
      },
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'maintenance'],
      default: 'available',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

RoomSchema.index({
  name: 'text',
  description: 'text',
  amenities: 'text',
});


export default mongoose.model<IRoom>('Room', RoomSchema);