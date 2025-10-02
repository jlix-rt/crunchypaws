import { Router } from 'express';
import { CartController } from '@/controllers/CartController';
import { validateBody } from '@/middleware/validation';
import { cartPriceSchema } from '@/utils/validation';

const router = Router();
const cartController = new CartController();

// Rutas públicas para cálculos de carrito
router.post('/price', validateBody(cartPriceSchema), cartController.calculatePrice);
router.post('/validate', cartController.validateItems);

export default router;
