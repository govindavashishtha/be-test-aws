import { redisClient } from '../app';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function cacheOTP(phoneNumber: string, otp: string): Promise<void> {
  await redisClient.set(`otp:${phoneNumber}`, otp, 'EX', 300); // expires in 5 minutes
}

export async function verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
  const cachedOTP = await redisClient.get(`otp:${phoneNumber}`);
  if (!cachedOTP) return false;
  
  const isValid = cachedOTP === otp;
  if (isValid) {
    await redisClient.del(`otp:${phoneNumber}`);
  }
  
  return isValid;
} 