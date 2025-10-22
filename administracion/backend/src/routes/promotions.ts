import { Router } from 'express';
import { PromotionController } from '../controllers/PromotionController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const promotionController = new PromotionController();

// Rutas de promociones
router.get('/', authenticateToken, requireAdmin, promotionController.getPromotions);

export default router;