export interface RegisterRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'member' | 'trainer';
  societyId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: 'member' | 'trainer';
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
} 