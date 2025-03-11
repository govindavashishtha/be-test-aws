import { Request } from 'express';

export interface BookingResponse {
  id: string;
  userId: string;
  eventId: string;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  event?: {
    name: string;
    eventDate: Date;
    startTime: string;
    endTime: string;
  };
  user?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}

export interface MemberResponse {
  id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  status: 'pending' | 'approved' | 'rejected';
  societyId: string;
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

export interface CreateBookingRequest {
  memberId: string;
  eventId: string;
}

export interface UpdateMemberRequest {
  status: 'approved' | 'rejected';
  societyId?: string;
  subscriptionId?: string;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  type: 'email' | 'sms';
  title: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export type MemberStatus = 'approved' | 'rejected';

export interface UpdateMemberStatusRequest {
  id: string;
  status: MemberStatus;
}

export interface CreateMemberRequest {
  userId: string;
  societyId: string;
  subscriptionId?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface UserResponse {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
  role: string;
  status: string;
  societyId?: string;
  createdAt: Date;
  updatedAt: Date;
  society?: {
    name: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
  societyId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: string;
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
    role: string;
    phoneNumber?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateSocietyRequest {
  name: string;
  location: string;
  maxMembersPerEvent?: number;
}

export interface UpdateSocietyRequest {
  name?: string;
  location?: string;
  maxMembersPerEvent?: number;
}

export interface SocietyResponse {
  id: string;
  name: string;
  location: string;
  maxMembersPerEvent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    societyId?: string;
    role: string;
  };
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'member' | 'trainer' | 'society_admin';
  societyId?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface CreateEventRequest {
  name: string;
  societyId: string;
  trainerId: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  maxMembers?: number;
}

export interface UpdateEventRequest {
  name?: string;
  trainerId?: string;
  eventDate?: Date;
  startTime?: string;
  endTime?: string;
  maxMembers?: number;
}

export interface EventResponse {
  id: string;
  name: string;
  societyId: string;
  trainerId: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  maxMembers: number;
  createdAt: Date;
  updatedAt: Date;
  society?: { name: string };
  trainer?: { name: string };
}

export interface CreateNotificationRequest {
  userId: string;
  type: 'email' | 'sms';
  title: string;
  message: string;
  email?: string;
  phoneNumber?: string;
}

export interface CreateTrainerRequest {
  name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
}

export interface UpdateTrainerRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  specialization?: string;
}

export interface TrainerResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  createdAt: Date;
  updatedAt: Date;
  events?: Array<{
    id: string;
    name: string;
    eventDate: Date;
    startTime: string;
    endTime: string;
  }>;
}

export interface CreateSubscriptionRequest {
  name: string;
  price: number;
  durationInDays: number;
}

export interface SubscriptionResponse {
  id: string;
  name: string;
  price: number;
  durationInDays: number;
  createdAt: Date;
  updatedAt: Date;
} 