import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authenticateToken, requireClient } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createReviewSchema } from '../validators/reviewSchemas';

const router = Router();
const reviewController = new ReviewController();

// GET /api/reviews/product/:productId
router.get('/product/:productId', reviewController.getProductReviews);

// POST /api/reviews
router.post('/', authenticateToken, requireClient, validateRequest(createReviewSchema), reviewController.createReview);

// PUT /api/reviews/:id
router.put('/:id', authenticateToken, requireClient, reviewController.updateReview);

// DELETE /api/reviews/:id
router.delete('/:id', authenticateToken, requireClient, reviewController.deleteReview);

export default router;


