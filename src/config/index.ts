export interface Config {
  redis: {
    url: string;
  };
  // ... other config properties
}

const config: Config = {
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  // ... other config values
};

export default config; 