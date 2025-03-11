import { SchedulerConfig } from '../types';

const config: SchedulerConfig = {
  jobs: {
    weeklySchedule: {
      cronTime: '0 0 * * SUN', // Every Sunday at midnight
      timezone: 'UTC',
    },
    notifications: {
      cronTime: '0 * * * *', // Every hour
      timezone: 'UTC',
    },
    paymentCheck: {
      cronTime: '0 0 * * *', // Every day at midnight
      timezone: 'UTC',
    },
    membershipCheck: {
      cronTime: '0 0 * * *', // Every day at midnight
      timezone: 'UTC',
    },
  },
  retryAttempts: 3,
  retryDelay: 5000, // 5 seconds
};

export default config; 