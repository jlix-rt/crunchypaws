import { Router } from 'express';
import { OrderController } from '@/controllers/OrderController';
import { validateBody } from '@/middleware/validation';
import { authenticateToken, optionalAuth } from '@/middleware/auth';
import { orderLimiter } from '@/middleware/rateLimit';
import { orderSchema } from '@/utils/validation';

const router = Router();
const orderController = new OrderController();

// Crear orden (con o sin autenticación)
router.post('/', orderLimiter, optionalAuth, validateBody(orderSchema), orderController.createOrder);

// Obtener orden específica (pública para permitir seguimiento)
router.get('/:id', orderController.getOrder);

// Rutas protegidas
router.get('/', authenticateToken, orderController.getUserOrders);
router.get('/stats', authenticateToken, orderController.getOrderStats);

// Rutas administrativas (requieren autenticación adicional en producción)
router.put('/:id/status', orderController.updateOrderStatus);

export default router;
