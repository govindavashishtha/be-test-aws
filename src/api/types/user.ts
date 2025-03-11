export interface CreateUserRequest {
  name: string;
  email?: string;
  phoneNumber: string;
  password: string;
  role: 'member' | 'trainer' | 'society_admin';
  societyId?: string;
  subscriptionId?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  role: 'member' | 'trainer' | 'society_admin';
  status: 'pending' | 'approved' | 'rejected';
  societyId?: string;
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
  society?: {
    name: string;
  };
  subscription?: {
    name: string;
    durationInDays: number;
  };
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  role?: 'member' | 'trainer' | 'society_admin';
  status?: 'pending' | 'approved' | 'rejected';
  societyId?: string;
  subscriptionId?: string;
} 