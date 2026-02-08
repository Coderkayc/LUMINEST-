import express from 'express';
import { linkMeter, getMeterStats, getDailyUsage } from '../controllers/meter.controller.js';
import { togglePower } from '../controllers/control.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/link', protect, linkMeter);
router.post('/toggle', protect, togglePower);
router.get('/:id/daily-usage', protect, getDailyUsage);
router.get('/:id', protect, getMeterStats);

export default router;