import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const reviewController = new ReviewController();

// Rutas de reseñas
router.get('/', authenticateToken, requireAdmin, reviewController.getReviews);

export default router;