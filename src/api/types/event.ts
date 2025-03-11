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
  society?: {
    name: string;
  };
  trainer?: {
    name: string;
  };
} 