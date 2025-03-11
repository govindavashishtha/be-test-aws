export * from './auth';
export * from './booking';
export * from './common';
export * from './event';
export * from './member';
export * from './notification';
export * from './society';
export * from './subscription';
export * from './trainer';
export * from './user';

import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    id: string;
    role: 'member' | 'trainer' | 'society_admin' | 'super_admin';
    societyId?: string;
  };
} 