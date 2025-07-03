"use server"
import "server-only"
import { redirect } from "next/navigation"
import dbConnect from "@/dbConnect";
import { cookies } from "next/headers"
import { verifyUser } from "./authguard";
import { logIn } from "./loginauth";
import { signUp } from "./signupauth";

type FormState = {
  success: boolean;
  message: string;
  token?: string;
};

export async function handleSignUp(prevState: FormState | null, formData: FormData): Promise<FormState> {
  try {
    await dbConnect();
    
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const username = formData.get('username')?.toString() || '';
    
    const result = await signUp({ email, password, username });
    
    if (result.success && result.token) {
      (await cookies()).set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/',
      });
      // redirect('/login');

    }
    
    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Signup failed',
    };
  }
}

export async function handleLogIn(prevState: FormState | null, formData: FormData): Promise<FormState> {
  try {
    await dbConnect();
    
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    
    const result = await logIn({ email, password});
    
    if (result.success && result.token) {
      (await cookies()).set('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/',
      });
      // redirect('/admin');
    }
    
    return result;
  } catch (error) {
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

export async function getCurrentUser(){
 await verifyUser()
}