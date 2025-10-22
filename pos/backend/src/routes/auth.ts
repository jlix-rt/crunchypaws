import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middleware/validation';
import { loginSchema, refreshTokenSchema } from '../validators/authSchemas';

const router = Router();
const authController = new AuthController();

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), authController.login);

// POST /api/auth/refresh
router.post('/refresh', validateRequest(refreshTokenSchema), authController.refreshToken);

// POST /api/auth/logout
router.post('/logout', authController.logout);

export default router;



