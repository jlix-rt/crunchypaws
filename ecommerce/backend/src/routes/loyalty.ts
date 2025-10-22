import { Router } from 'express';
import { LoyaltyController } from '../controllers/LoyaltyController';
import { authenticateToken, requireClient } from '../middleware/auth';

const router = Router();
const loyaltyController = new LoyaltyController();

// GET /api/loyalty/account
router.get('/account', authenticateToken, requireClient, loyaltyController.getAccount);

// GET /api/loyalty/transactions
router.get('/transactions', authenticateToken, requireClient, loyaltyController.getTransactions);

// GET /api/loyalty/tiers
router.get('/tiers', loyaltyController.getTiers);

// POST /api/loyalty/redeem
router.post('/redeem', authenticateToken, requireClient, loyaltyController.redeemPoints);

export default router;


