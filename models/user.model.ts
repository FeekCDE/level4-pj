import { Document, Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  
  email: string;
  password: string;
  joinedOn: Date;
  name: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  
  email: { type: String, required: true, unique: true },
  name:{type: String, required: true, unique: true },
  password: { type: String, required: true },
  joinedOn: { type: Date, default: Date.now }
});


userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = models.User || model<IUser>('User', userSchema);
