export interface CreateNotificationRequest {
  userId: string;
  type: 'email' | 'sms';
  title: string;
  message: string;
  email?: string;
  phoneNumber?: string;
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