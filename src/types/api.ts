import { Request } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'member' | 'trainer' | 'society_admin' | 'super_admin';
  };
}

export interface CreateSocietyRequest {
  name: string;
  location: string;
  maxMembersPerEvent: number;
}

export interface CreateEventRequest {
  name: string;
  societyId: string;
  trainerId: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  maxMembers: number;
}

export interface CreateBookingRequest {
  memberId: string;
  eventId: string;
}

// Add other API related types as needed
