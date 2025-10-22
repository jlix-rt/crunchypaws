import { Router } from 'express';
import { ShippingController } from '../controllers/ShippingController';
import { validateRequest } from '../middleware/validation';
import { calculateShippingSchema } from '../validators/shippingSchemas';

const router = Router();
const shippingController = new ShippingController();

// POST /api/shipping/calculate
router.post('/calculate', validateRequest(calculateShippingSchema), shippingController.calculateShipping);

// GET /api/shipping/rates
router.get('/rates', shippingController.getShippingRates);

export default router;


