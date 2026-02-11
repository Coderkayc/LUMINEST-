import express from 'express';
import { initializePayment, handleWebhook, getPaymentHistory } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/initialize', protect, initializePayment);
router.post('/webhook', handleWebhook);
router.get('/history', protect, getPaymentHistory);

export default router;