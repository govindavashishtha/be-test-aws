import { Notification } from '../db/models';
import { CreateNotificationRequest, NotificationResponse } from '../api/types';
import { sendEmail, sendSMS } from '../utils/notifications';
import { BaseService } from './base.service';

const toNotificationResponse = (notification: Notification): NotificationResponse => ({
  id: notification.id,
  userId: notification.userId,
  type: notification.type,
  title: notification.title,
  message: notification.message,
  status: notification.status,
  createdAt: notification.createdAt,
  updatedAt: notification.updatedAt
});

export class NotificationService extends BaseService<
  Notification,
  CreateNotificationRequest,
  never,
  NotificationResponse
> {
  private static instance: NotificationService;

  private constructor() {
    super(Notification as any, toNotificationResponse);
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async create(data: CreateNotificationRequest): Promise<NotificationResponse> {
    const notification = await Notification.create({
      ...data,
      status: 'pending'
    });

    // Send notification based on type
    if (data.type === 'email' && data.email) {
      await sendEmail(data.email, data.title, data.message);
    } else if (data.type === 'sms' && data.phoneNumber) {
      await sendSMS(data.phoneNumber, data.message);
    }

    await notification.update({ status: 'sent' });
    return toNotificationResponse(notification);
  }

  async findByUser(userId: string): Promise<NotificationResponse[]> {
    return this.findAll({ userId }, { order: [['createdAt', 'DESC']] });
  }
}
