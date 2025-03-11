export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  dialect: 'postgres';
  logging: boolean | ((sql: string) => void);
}

export interface QueueConfig {
  host: string;
  port: number;
  queues: {
    notifications: string;
    payments: string;
    scheduler: string;
  };
  options: {
    durable: boolean;
    persistent: boolean;
  };
}

export interface SchedulerConfig {
  jobs: {
    weeklySchedule: {
      cronTime: string;
      timezone: string;
    };
    notifications: {
      cronTime: string;
      timezone: string;
    };
    paymentCheck: {
      cronTime: string;
      timezone: string;
    };
    membershipCheck: {
      cronTime: string;
      timezone: string;
    };
  };
  retryAttempts: number;
  retryDelay: number;
} 