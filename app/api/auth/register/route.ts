import { NextResponse } from 'next/server';
import dbConnect from '@/dbConnect';
import UserModel from '@/models/user.model';

export async function POST(request: Request) {
  const { firstName, lastName, email, phone, password } = await request.json();

  try {
    await dbConnect;

    // 1. Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 400 }
      );
    }

    // 2. Create new user (password hashing is handled in the model pre-save hook)
    const user = await UserModel.create({
        firstName,
        lastName,
      email,
      phone,
      password,
      role: 'user'
    });

    // 3. Return user without password
    const userWithoutPassword = user.toObject();
    // delete userWithoutPassword.password;

    return NextResponse.json(
      { success: true, user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
    console.log(error)
  }
}