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