import { User } from '../../db/models';

export interface LoginRequest {
  email: string;
  password: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}

export interface SignUpData {
  name: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
  };
}

export interface OTPResponse {
  otpReference: string;
}

export interface SignUpResponse {
  user: User;
  otpReference: string;
}

export interface VerifyTokenRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: 'member' | 'trainer' | 'society_admin';
}

export interface VerifyTokenResponse {
  user: {
    id: string;
    name: string;
    email?: string;
    role: string;
    status: string;
  };
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface FirebaseDecodedToken {
  uid: string;
  email?: string;
  name?: string;
  phone_number?: string;
  // Add other Firebase token fields as needed
  iss: string;
  aud: string;
  auth_time: number;
  exp: number;
  iat: number;
}

export interface UserLoginRequest {
  // No body parameters needed as we're getting token from header
}

export interface UserLoginResponse {
  user: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    role: string;
    status: string;
  };
  token: {
    accessToken: string;
    refreshToken: string;
    firebaseToken: string;
  };
} 