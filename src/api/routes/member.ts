import { Router, Request } from 'express';
import { authenticate, authorize } from '../middleware';
import { getMemberService } from '../../services';
import { MemberResponse, ApiResponse } from '../types';
import { JWTPayload } from 'jose';

const router = Router();
const memberService = getMemberService();

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a society admin
 *       500:
 *         description: Server error
 */
router.get('/', 
  authenticate,
  authorize(['society_admin']),
  async (req: Request, res) => {
    try {
      const societyId = (req.user as JWTPayload)?.societyId;
      const members = await memberService.findAll(
        societyId ? { societyId } : undefined
      );
      res.json({ success: true, data: members });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch members' });
    }
  }
);

/**
 * @swagger
 * /api/members/{id}/status:
 *   patch:
 *     summary: Update member status
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a society admin
 *       404:
 *         description: Member not found
 *       500:
 *         description: Server error
 */
router.patch<{ id: string }, ApiResponse<MemberResponse>>(
  '/:id/status',
  authenticate,
  authorize(['society_admin']),
  async (req, res) => {
    try {
      const member = await memberService.updateStatus({
        id: req.params.id,
        status: req.body.status
      }); 
      if (!member) {
        return res.status(404).json({ success: false, error: 'Member not found' });
      }
      res.json({ success: true, data: member });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update member status' });
    }
  }
);

export default router; 