import { User } from '../db/models';
import { generateTokens } from '../utils/jwt.utils';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  SignUpData,
  SignUpResponse,
  OTPResponse 
} from '../api/types/auth.types';
import { compare, hash } from 'bcrypt';
import { AuthError } from '../utils/errors';
import { UserAttributes, CreateUserAttributes } from '../db/models/user.model';
import { BaseService } from './base.service';

import crypto from 'crypto';
import  RedisService  from './redis.service';
import Redis from 'ioredis';
import { FirebaseService } from './firebase.service';
import { FirebaseDecodedToken } from '../api/types/auth.types';

export class AuthService extends BaseService<User, UserAttributes, CreateUserAttributes, AuthResponse> {
  private static instance: AuthService;
  private redis: RedisService;
  private readonly OTP_EXPIRY = 300; // 5 minutes
  private firebaseService: FirebaseService;

  private constructor(redisClient: Redis) {
    super(User as any, AuthService.toAuthResponse);
    this.redis = RedisService.getInstance(redisClient);
    this.firebaseService = FirebaseService.getInstance();
  }

  public static getInstance(redisClient?: Redis): AuthService {
    if (!AuthService.instance && redisClient) {
      AuthService.instance = new AuthService(redisClient);
    }
    if (!AuthService.instance) {
      throw new Error('Auth service not initialized');
    }
    return AuthService.instance;
  }

  private static generateToken(userId: string, role: string): { accessToken: string; refreshToken: string } {
    return generateTokens({ id: userId, role });
  }

  static toAuthResponse = async (user: User): Promise<AuthResponse> => {
    const token = AuthService.generateToken(user.id, user.role);
    const firebaseToken = await FirebaseService.getInstance().generateCustomToken(user.id);
    
    return {
      token: {
        ...token,
        refreshToken: firebaseToken,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email!,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    };
  };

  // Extract OTP logic to separate class
  private otpManager = {
    generate: (): string => Math.floor(100000 + Math.random() * 900000).toString(),
    
    store: async (reference: string, data: { otp: string; phoneNumber: string }): Promise<void> => {
      await this.redis.set(
        `otp:${reference}`,
        JSON.stringify(data),
        { duration: this.OTP_EXPIRY }
      );
    },

    verify: async (reference: string, otp: string): Promise<boolean> => {
      const stored = await this.redis.get(`otp:${reference}`);
      if (!stored) return false;
      const data = JSON.parse(stored);
      return data.otp === otp;
    }
  };

  // Add password management helpers
  private async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  /**
   * Create new user
   */
  async signUp(userData: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    return User.create({
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      role: 'member',
      status: 'pending'
    });
  }

  // Improve login method with better error handling
  async login(credentials: { uid: string } | LoginRequest): Promise<AuthResponse> {
    try {
      if ('uid' in credentials) {
        return this.loginWithUid(credentials.uid);
      }
      return this.loginWithCredentials(credentials);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async loginWithUid(uid: string): Promise<AuthResponse> {
    const user = await this.findByIdOrThrow(uid);
    return AuthService.toAuthResponse(user);
  }

  private async loginWithCredentials(credentials: LoginRequest): Promise<AuthResponse> {
    const user = await User.findOne({
      where: { 
        email: credentials.email,
        role: credentials.role 
      }
    });

    if (!user || !(await this.verifyPassword(credentials.password, user.password))) {
      throw new AuthError('Invalid credentials');
    }

    return AuthService.toAuthResponse(user);
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await User.findOne({ 
      where: { email: data.email }
    });
    
    if (existingUser) {
      throw new AuthError('Email already exists');
    }

    if (!['member', 'trainer', 'society_admin'].includes(data.role)) {
      throw new AuthError('Invalid role');
    }

    const hashedPassword = await this.hashPassword(data.password);
    const user = await User.create({
      ...data,
      role: data.role as 'member' | 'trainer' | 'society_admin',
      password: hashedPassword,
      status: 'pending'
    });

    return AuthService.toAuthResponse(user);
  }

  async signUpWithOTP(data: SignUpData): Promise<SignUpResponse> {
    // Check if user exists
    const existingUser = await User.findOne({ where: { phoneNumber: data.phoneNumber } });
    if (existingUser) {
      throw { code: 'USER_EXISTS', message: 'User already exists' };
    }

    // Create new user
    const user = await User.create({
      name: data.name,
      phoneNumber: data.phoneNumber,
      status: 'pending' // User status remains pending until OTP verification
    });

    // Generate and send OTP
    const otpReference = await this.generateAndSendOTP(data.phoneNumber);

    return { user, otpReference };
  }

  async sendOTP(phoneNumber: string, isResend: boolean = false): Promise<OTPResponse> {
    // If not resend, verify user exists
    if (!isResend) {
      const user = await User.findOne({ where: { phoneNumber } });
      if (!user) {
        throw { code: 'USER_NOT_FOUND', message: 'User not found' };
      }
    }

    // Generate and send new OTP
    const otpReference = await this.generateAndSendOTP(phoneNumber);

    return { otpReference };
  }

  private async generateAndSendOTP(phoneNumber: string): Promise<string> {
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Generate a reference ID for this OTP
    const otpReference = crypto.randomUUID();

    // Store OTP with reference
    await this.otpManager.store(otpReference, { otp, phoneNumber });

    // Send OTP via SMS
    await this.sendSMS(phoneNumber, `Your verification code is: ${otp}`);

    return otpReference;
  }

  private async sendSMS(phoneNumber: string, message: string): Promise<void> {
    // Implement your SMS sending logic
    // This is a placeholder - implement your actual SMS service
    console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResponse> {
    const isValid = await this.otpManager.verify(otp, phoneNumber);
    if (!isValid) {
      throw new AuthError('Invalid OTP');
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      throw new AuthError('User not found');
    }

    return AuthService.toAuthResponse(user);
  }

  public async validateFirebaseToken(idToken: string): Promise<FirebaseDecodedToken> {
    try {
      return await this.firebaseService.verifyIdToken(idToken) as FirebaseDecodedToken;
    } catch (error) {
      throw new Error('Invalid Firebase token');
    }
  }

  public async generateFirebaseToken(uid: string): Promise<string> {
    try {
      return await this.firebaseService.generateCustomToken(uid);
    } catch (error) {
      throw new Error('Failed to generate Firebase token');
    }
  }
}
