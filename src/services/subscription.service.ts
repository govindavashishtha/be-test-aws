import { Subscription } from '../db/models';
import { CreateSubscriptionRequest, SubscriptionResponse } from '../api/types';
import { BaseService } from './base.service';
import { NotFoundError } from '../utils/errors';

export const toSubscriptionResponse = (subscription: Subscription): SubscriptionResponse => ({
  id: subscription.id,
  name: subscription.name,
  price: subscription.price,
  durationInDays: subscription.durationInDays,
  createdAt: subscription.createdAt,
  updatedAt: subscription.updatedAt
}); 
export class SubscriptionService extends BaseService<Subscription, CreateSubscriptionRequest, never, SubscriptionResponse> {
  private static instance: SubscriptionService;

  private constructor() {
    super(Subscription as any, toSubscriptionResponse);
  }

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  async create(data: CreateSubscriptionRequest): Promise<SubscriptionResponse> {
    const subscription = await Subscription.create({
      name: data.name,
      price: data.price,
      durationInDays: data.durationInDays
    });

    return toSubscriptionResponse(subscription);
  }

  async findAll(): Promise<SubscriptionResponse[]> {
    const subscriptions = await Subscription.findAll();
    return subscriptions.map(toSubscriptionResponse);
  }

  async findById(id: string): Promise<SubscriptionResponse> {
    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      throw new NotFoundError('Subscription not found');
    }
    return toSubscriptionResponse(subscription);
  }
} 