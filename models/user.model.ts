import bcrypt from "bcryptjs";
import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: [true, "First name is required"] },
  lastName: { type: String, required: [true, "Last name is required"] },
  phone: { type: String, required: [true, "Phone number is required"] },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please fill a valid email address"],
  },
  password: { type: String, required: [true, "Password is required"] },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, {
  timestamps: true,
});

userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
  catch (error: unknown) {
  if (error instanceof Error) {
    next(error);
  } else {
    next(new Error('An unexpected error occurred during password hashing.'));
  }
}
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel: Model<IUser> = mongoose.models.Users || mongoose.model<IUser>("Users", userSchema);

export default UserModel;
