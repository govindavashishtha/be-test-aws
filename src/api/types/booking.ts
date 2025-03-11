export interface CreateBookingRequest {
  eventId: string;
  memberId: string;
}
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
  user?: {  // Add this
    name: string;
    email: string;
    phoneNumber: string;
  };
}