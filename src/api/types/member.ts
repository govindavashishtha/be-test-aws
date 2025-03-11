export interface CreateMemberRequest {
  name: string;
  email: string;
  phoneNumber: string;
  societyId: string;
  subscriptionId: string;
  password: string;
}

export interface UpdateMemberRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  subscriptionId?: string;
}

export interface MemberResponse {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  status: 'pending' | 'approved' | 'rejected';
  societyId: string;
  subscriptionId: string;
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