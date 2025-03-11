import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().regex(/^\+[1-9]\d{10,14}$/, 'Invalid phone number format. Must include country code (e.g. +1234567890)'),
});

export const sendOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{10,14}$/, 'Invalid phone number format'),
  isResend: z.boolean().optional().default(false)
});

export const verifyOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{10,14}$/, 'Invalid phone number format'),
  otp: z.string().length(6, 'OTP must be 6 digits')
}); 