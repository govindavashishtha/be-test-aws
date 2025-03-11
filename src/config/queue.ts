import { QueueConfig } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const config: QueueConfig = {
  host: process.env.QUEUE_HOST || 'localhost',
  port: parseInt(process.env.QUEUE_PORT || '5672', 10),
  queues: {
    notifications: 'notifications_queue',
    payments: 'payments_queue',
    scheduler: 'scheduler_queue',
  },
  options: {
    durable: true,
    persistent: true,
  },
};

export default config; 