"use server"
import "server-only"
import { redirect } from "next/navigation"
import dbConnect from "@/dbConnect";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import UserModel, { IUser } from "@/models/user.model";
import bcrypt from 'bcryptjs';
import { HydratedDocument } from "mongoose";

type FormState = {
  success: boolean;
  message: string;
  token?: string;
};

interface SignUpCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = Number (process.env.JWT_EXPIRES_IN);

export async function handleSignUp(prevState: FormState | null, formData: FormData): Promise<FormState> {
  try {
    await dbConnect();
    
    const credentials: SignUpCredentials = {
      firstName: formData.get('firstName')?.toString() || '',
      lastName: formData.get('lastName')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      password: formData.get('password')?.toString() || '',
      phone: formData.get('phone')?.toString() || '',
    };

    // Validate required fields
    if (!credentials.firstName || !credentials.lastName || !credentials.email || !credentials.password) {
      return {
        success: false,
        message: 'All fields are required',
      };
    }

    // Check if user exists
    const existingUser = await UserModel.findOne({ email: credentials.email });
    if (existingUser) {
      return {
        success: false,
        message: 'Email already in use',
      };
    }

    // Create user (password hashing is handled in model pre-save hook)
    const user = await UserModel.create({
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      password: credentials.password,
      phone: credentials.phone,
      role: 'user' // Default role
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN}
    );

    // Set secure HTTP-only cookie
    (await
      // Set secure HTTP-only cookie
      cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict'
    });

    return {
      success: true,
      message: 'Account created successfully',
      token
    };

  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Signup failed',
    };
  }
}

export async function handleLogIn(prevState: FormState | null, formData: FormData): Promise<FormState> {
  try {
    await dbConnect();
    
    const credentials: LoginCredentials = {
      email: formData.get('email')?.toString() || '',
      password: formData.get('password')?.toString() || '',
    };

    // Find user with password field
    const user = await UserModel.findOne({ email: credentials.email }).select('+password');
    if (!user) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    // Verify password
    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
      return {
        success: false,
        message: 'Invalid credentials',
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set secure HTTP-only cookie
    (await
      // Set secure HTTP-only cookie
      cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict'
    });

    return {
      success: true,
      message: 'Login successful',
      token
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

export async function handleLogOut() {
  (await cookies()).delete('token');
  redirect('/login');
}

export async function getCurrentUser() {
  try {
    await dbConnect();
    const token = (await cookies()).get('token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
    };

    const user = await UserModel.findById(decoded.id).select('-password');
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function authMiddleware(
  handler: (req: Request, user: HydratedDocument<IUser>) => Promise<Response>,
  allowedRoles?: string[]
) {
  return async (request: Request): Promise<Response> => {
    try {
      await dbConnect();

      const token = (await cookies()).get('token')?.value;
      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Not authorized' },
          { status: 401 }
        );
      }

      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        role: string;
        firstName: string;
        lastName: string;
      };

      const user = await UserModel.findById(decoded.id).select('-password');
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 401 }
        );
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized access' },
          { status: 403 }
        );
      }

      return handler(request, user);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
  };
}