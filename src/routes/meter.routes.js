import express from 'express';
import { linkMeter, getMeterStats } from '../controllers/meter.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/link', protect, linkMeter);
router.get('/:id', protect, getMeterStats);

export default router;