import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { addToCartSchema, updateCartItemSchema } from '../validators/cartSchemas';

const router = Router();
const cartController = new CartController();

// GET /api/cart
router.get('/', authenticateToken, cartController.getCart);

// POST /api/cart/add
router.post('/add', authenticateToken, validateRequest(addToCartSchema), cartController.addToCart);

// PUT /api/cart/update/:itemId
router.put('/update/:itemId', authenticateToken, validateRequest(updateCartItemSchema), cartController.updateCartItem);

// DELETE /api/cart/remove/:itemId
router.delete('/remove/:itemId', authenticateToken, cartController.removeFromCart);

// DELETE /api/cart/clear
router.delete('/clear', authenticateToken, cartController.clearCart);

// POST /api/cart/apply-coupon
router.post('/apply-coupon', authenticateToken, cartController.applyCoupon);

// DELETE /api/cart/remove-coupon
router.delete('/remove-coupon', authenticateToken, cartController.removeCoupon);

// GET /api/cart/total
router.get('/total', authenticateToken, cartController.getCartTotal);

export default router;

