import { Router } from 'express';
import { PaymentController } from '@/controllers/PaymentController';

const router = Router();
const paymentController = new PaymentController();

// Rutas públicas
router.get('/methods', paymentController.getPaymentMethods);
router.post('/intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);
router.get('/status/:paymentIntentId', paymentController.getPaymentStatus);

// Webhook para procesadores de pago
router.post('/webhook', paymentController.handleWebhook);

export default router;
