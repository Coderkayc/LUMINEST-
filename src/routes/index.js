import express from 'express';
import authRoutes from './auth.routes.js';
import meterRoutes from './meter.routes.js';
import paymentRoutes from './payment.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/meters', meterRoutes);
router.use('/payments', paymentRoutes);

export default router;