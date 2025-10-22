import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authenticateToken, requireClient } from '../middleware/auth';

const router = Router();
const paymentController = new PaymentController();

// GET /api/payments/methods
router.get('/methods', paymentController.getPaymentMethods);

// POST /api/payments/process
router.post('/process', authenticateToken, requireClient, paymentController.processPayment);

// POST /api/payments/webhook
router.post('/webhook', paymentController.handleWebhook);

// GET /api/payments/:id/status
router.get('/:id/status', authenticateToken, requireClient, paymentController.getPaymentStatus);

export default router;

