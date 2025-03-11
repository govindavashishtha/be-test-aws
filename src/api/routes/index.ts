import { Router } from 'express';

const router = Router();

export function initializeRoutes() {
  // Import routes only after services are initialized
  const societyRoutes = require('./society').default;
  const authRoutes = require('./auth').default;
  const bookingRoutes = require('./booking').default;
  const eventRoutes = require('./event').default;
  // ... other route imports

  router.use('/society', societyRoutes);
  router.use('/auth', authRoutes);
  router.use('/booking', bookingRoutes);
  router.use('/event', eventRoutes);
  // ... other route registrations

  return router;
}

export default router; 