export interface CreateTrainerRequest {
  name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  password: string;
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