import { Router } from 'express';
import { validateFirebaseToken } from '../middleware';
import { AuthService } from '../../services/auth.service';
import { validateSchema } from '../middleware';
import { signUpSchema, sendOTPSchema, verifyOTPSchema } from '../schemas/auth.schema';
import { getRedisClient } from '../../app';
import { UserAttributes } from '../../db/models/user.model';
import { User } from '../../db/models/user.model';
import { Op } from 'sequelize';
import { CreateUserAttributes } from '../../db/models/user.model';
import { 
  VerifyTokenRequest, 
  VerifyTokenResponse, 
  FirebaseDecodedToken,
  UserLoginRequest,
  UserLoginResponse
} from '../types/auth.types';
import { Request, Response } from 'express';

const router = Router();

// Initialize auth service with Redis client
const authService = AuthService.getInstance(getRedisClient());

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user with Firebase token
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid Firebase token
 */
router.post('/login', validateFirebaseToken, async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('No user found');
    }
    
    const uid = 'uid' in req.user ? req.user.uid : req.user.id;
    const tokens = await authService.login({ uid });
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ message: 'Login failed' });
  }
});

/**
 * @swagger
 * /auth/sign-up:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user and send OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully and OTP sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 otpReference:
 *                   type: string
 *       400:
 *         description: Invalid input data or user already exists
 */
router.post('/sign-up', validateSchema(signUpSchema), async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    
    // Create user and send OTP
    const { user, otpReference } = await authService.signUpWithOTP({
      name,
      phoneNumber
    });

    res.status(201).json({
      message: 'User created successfully. Please verify OTP.',
      otpReference
    });
  } catch (error: any) {
    if (error.code === 'USER_EXISTS') {
      res.status(409).json({ message: 'User already exists' });
    } else {
      res.status(400).json({ message: error?.message || 'Sign up failed' });
    }
  }
});

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Send/Resend OTP to phone number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - isResend
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               isResend:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 otpReference:
 *                   type: string
 *       400:
 *         description: Invalid phone number or user not found
 */
router.post('/send-otp', validateSchema(sendOTPSchema), async (req, res) => {
  try {
    const { phoneNumber, isResend } = req.body;
    
    // Handle OTP generation and sending
    const result = await authService.sendOTP(phoneNumber, isResend);
    
    res.json({
      message: isResend ? 'OTP resent successfully' : 'OTP sent successfully',
      otpReference: result.otpReference
    });
  } catch (error: any) {
    if (error.code === 'USER_NOT_FOUND' && !req.body.isResend) {
      res.status(404).json({ message: 'User not found. Please sign up first.' });
    } else {
      res.status(400).json({ message: error?.message || 'Failed to send OTP' });
    }
  }
});

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify OTP and get tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - otp
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */
router.post('/verify-otp', validateSchema(verifyOTPSchema), async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const result = await authService.verifyOTP(phoneNumber, otp);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error?.message || 'Failed to verify OTP' });
  }
});

/**
 * @swagger
 * /auth/verify-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify Firebase token and create/update user
 *     description: Verifies Firebase ID token from Authorization header and creates/updates user in the system
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyTokenRequest'
 *     responses:
 *       200:
 *         description: Token verified and user created/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyTokenResponse'
 *       401:
 *         description: Invalid or missing token
 *       400:
 *         description: Invalid user data
 */
router.post(
  '/verify-token',
  async (req: Request<{}, {}, VerifyTokenRequest>, res: Response<VerifyTokenResponse>) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' } as any);
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await authService.validateFirebaseToken(idToken) as FirebaseDecodedToken;

      // Create or update user with Firebase data and additional info
      const userData: Partial<UserAttributes> = {
        id: decodedToken.uid,
        email: decodedToken.email || req.body.email,
        name: req.body.name || decodedToken.name,
        phoneNumber: req.body.phoneNumber || decodedToken.phone_number,
        role: req.body.role || 'member',
        status: 'active'
      };

      // Find existing user by ID (Firebase UID) or email
      let user = await User.findOne({
        where: {
          [Op.or]: [
            { id: decodedToken.uid },
            { email: decodedToken.email }
          ]
        }
      });

      if (user) {
        // Update existing user
        user = await user.update(userData);
      } else {
        // Create new user
        user = await User.create(userData as CreateUserAttributes);
      }

      // Generate application tokens
      const authResponse = await AuthService.toAuthResponse(user);

      const response: VerifyTokenResponse = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        },
        token: authResponse.token
      };

      res.json(response);

    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ error: 'Invalid token or user data' } as any);
    }
  }
);

/**
 * @swagger
 * /auth/user-login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user with Firebase token and return user data with new tokens
 *     description: Validates Firebase token from headers, fetches user data, and returns refreshed tokens
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLoginResponse'
 *       401:
 *         description: Invalid or missing token
 *       404:
 *         description: User not found
 */
router.post(
  '/user-login',
  async (req: Request<{}, {}, UserLoginRequest>, res: Response<UserLoginResponse>) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' } as any);
      }

      const idToken = authHeader.split('Bearer ')[1];
      const decodedToken = await authService.validateFirebaseToken(idToken) as FirebaseDecodedToken;

      // Find user by Firebase UID
      const user = await User.findByPk(decodedToken.uid);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' } as any);
      }

      // Generate application tokens
      const authResponse = await AuthService.toAuthResponse(user);
      
      // Generate a new Firebase token
      const firebaseToken = await authService.generateFirebaseToken(user.id);

      // Combine the tokens
      const response: UserLoginResponse = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          status: user.status
        },
        token: {
          ...authResponse.token,
          firebaseToken
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: 'Invalid token' } as any);
    }
  }
);

export default router; 