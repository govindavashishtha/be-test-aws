import { Router } from 'express';
import { authenticate, authorize, validate } from '../middleware';
import { CreateSocietyRequest, UpdateSocietyRequest, SocietyResponse, ApiResponse } from '../types';
import { getSocietyService } from '../../services';
import { createSocietySchema, updateSocietySchema } from '../validators/society.validator';

const router = Router();
const societyService = getSocietyService();

/**
 * @swagger
 * /api/society:
 *   get:
 *     summary: Get all societies
 *     tags: [Societies]
 *     responses:
 *       200:
 *         description: List of societies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res, next) => {
  try {
    const societies = await societyService.findAll();
    res.json({ success: true, data: societies });
  } catch (error) {
    next(error);
  }
});

router.post<{}, ApiResponse<SocietyResponse>, CreateSocietyRequest>(
  '/',
  authenticate,
  authorize(['super_admin']),
  validate(createSocietySchema),
  async (req, res, next) => {
    try {
      const society = await societyService.create(req.body);
      res.status(201).json({ success: true, data: society });
    } catch (error) {
      next(error);
    }
  }
);

router.patch<{ id: string }, ApiResponse<SocietyResponse>, UpdateSocietyRequest>(
  '/:id',
  authenticate,
  authorize(['super_admin']),
  validate(updateSocietySchema),
  async (req, res, next) => {
    try {
      const society = await societyService.update(req.params.id, req.body);
      res.json({ success: true, data: society });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 