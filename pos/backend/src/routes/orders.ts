import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken, requireEmployee } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createPosOrderSchema } from '../validators/orderSchemas';

const router = Router();
const orderController = new OrderController();

// GET /api/orders
router.get('/', authenticateToken, requireEmployee, orderController.getOrders);

// GET /api/orders/:id
router.get('/:id', authenticateToken, requireEmployee, orderController.getOrderById);

// POST /api/orders
router.post('/', authenticateToken, requireEmployee, validateRequest(createPosOrderSchema), orderController.createOrder);

// PUT /api/orders/:id/cancel
router.put('/:id/cancel', authenticateToken, requireEmployee, orderController.cancelOrder);

// POST /api/orders/:id/print
router.post('/:id/print', authenticateToken, requireEmployee, orderController.printTicket);

export default router;



