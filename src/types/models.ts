export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Society extends BaseModel {
  name: string;
  location: string;
  maxMembersPerEvent: number;
}

export interface Member extends BaseModel {
  name: string;
  email: string;
  phoneNumber: string;
  societyId: string;
  subscriptionId: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Event extends BaseModel {
  name: string;
  societyId: string;
  trainerId: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  maxMembers: number;
}

export interface Booking extends BaseModel {
  memberId: string;
  eventId: string;
  status: 'confirmed' | 'cancelled';
}

export interface Subscription extends BaseModel {
  name: string;
  price: number;
  durationInDays: number;
}

// Add other model interfaces as needed
