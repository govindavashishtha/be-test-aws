import { DecodedIdToken } from 'firebase-admin/auth';

interface JWTPayload {
  id: string;
  role: string;
  societyId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken | JWTPayload;
    }
  }
}

export interface RequestWithUser extends Request {
  user?: DecodedIdToken | JWTPayload;
} 