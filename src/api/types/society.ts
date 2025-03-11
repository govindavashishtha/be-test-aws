export interface CreateSocietyRequest {
  name: string;
  location: string;
  maxMembersPerEvent: number;
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