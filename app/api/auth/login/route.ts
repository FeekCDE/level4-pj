import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/dbConnect';
import UserModel from '@/models/user.model';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    await dbConnect;
    
    // 1. Check if user exists
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // 4. Return user data (without password)
    const userWithoutPassword = user.toObject();
    // delete userWithoutPassword.password;

    return NextResponse.json(
      { success: true, token, user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
    console.log(error)
  }
}