import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken, requireClient } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createOrderSchema } from '../validators/orderSchemas';

const router = Router();
const orderController = new OrderController();

// GET /api/orders
router.get('/', authenticateToken, requireClient, orderController.getOrders);

// GET /api/orders/:id
router.get('/:id', authenticateToken, requireClient, orderController.getOrderById);

// POST /api/orders
router.post('/', authenticateToken, requireClient, validateRequest(createOrderSchema), orderController.createOrder);

// PUT /api/orders/:id/cancel
router.put('/:id/cancel', authenticateToken, requireClient, orderController.cancelOrder);

// GET /api/orders/:id/tracking
router.get('/:id/tracking', authenticateToken, requireClient, orderController.getOrderTracking);

// POST /api/orders/:id/review
router.post('/:id/review', authenticateToken, requireClient, orderController.createReview);

export default router;

