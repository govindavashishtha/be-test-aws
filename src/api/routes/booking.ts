import { Router } from 'express';
import { authenticate } from '../middleware';
import { CreateBookingRequest, ApiResponse, BookingResponse } from '../types';
import { getBookingService } from '../../services';

const router = Router();
const bookingService = getBookingService();

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post<{}, ApiResponse<BookingResponse>, CreateBookingRequest>(
  '/',
  authenticate,
  async (req, res) => {
    try {
      const booking = await bookingService.create(req.body);
      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create booking' });
    }
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.delete('/:id',
  authenticate,
  async (req, res) => {
    try {
      // Implementation for canceling booking
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to cancel booking' });
    }
});

export default router; 