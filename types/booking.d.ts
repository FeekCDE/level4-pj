import { Types } from "mongoose";

export interface IBookingRequest {
  roomId: string | Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
}

export interface IBookingResponse {
  success: boolean;
  message?: string;
  data?: any; // Replace with specific type if possible
}       