
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import UserModel from './user';


const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type UserInput = z.infer<typeof userSchema>;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export async function logIn(userData: UserInput) {
  try {
 
    const validatedData = userSchema.parse(userData);
    
    
    const user = await UserModel.findOne({ email: validatedData.email });
    if (!user) {
      throw new Error('User not found');
    }
    
    
    const passwordMatch = await user.comparePassword(validatedData.password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    
   
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    return { success: true, token, message: 'Login successful' };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Login failed' };
  }
}