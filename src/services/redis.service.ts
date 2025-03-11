import Redis from 'ioredis';
import { CacheService } from './interfaces/service.interface';

export default class RedisService implements CacheService {
  private static instance: RedisService;
  private client: Redis;

  private constructor(redisClient: Redis) {
    this.client = redisClient;
  }

  public static getInstance(redisClient?: Redis): RedisService {
    if (!RedisService.instance && redisClient) {
      RedisService.instance = new RedisService(redisClient);
    }
    if (!RedisService.instance) {
      throw new Error('Redis service not initialized');
    }
    return RedisService.instance;
  }

  async init(): Promise<void> {
    await this.client.ping();
  }

  async set(key: string, value: string, expiry: { duration: number }): Promise<'OK'> {
    return this.client.set(key, value, 'EX', expiry.duration);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }
} 