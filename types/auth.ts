import { User } from "./user";

// types/auth.d.ts
export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface ErrorResponse {
  message: string;
  error?: any;
}