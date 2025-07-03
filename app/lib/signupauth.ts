import jwt from 'jsonwebtoken';
import { z } from 'zod';
import UserModel from './user';



const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().max(20)
});
type UserInput = z.infer<typeof userSchema>;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export async function signUp(userData: UserInput) {
  try {
  
    const validatedData = userSchema.parse(userData);
    
    
    const existingUser = await UserModel.findOne({ email: validatedData.email });
    const availabelUsername = await UserModel.findOne({username: validatedData.username})
    if (existingUser || availabelUsername) {
      throw new Error('Username or Email already exists');
    }
    
   
    const user = new UserModel({
      email: validatedData.email,
      password: validatedData.password,
      username: validatedData.username
    });
    
    await user.save();
    
   
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    return { success: true, token, message: 'User created successfully' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Signup failed' };
  }
}


export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await UserModel.findById(decoded.userId);
    return user ? { success: true, user } : { success: false, message: 'User not found' };
  } catch (error) {
    return { success: false, message: `Invalid token${error}` };
  }
}