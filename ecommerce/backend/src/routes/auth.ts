import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middleware/validation';
import { loginSchema, registerSchema, refreshTokenSchema } from '../validators/authSchemas';

const router = Router();
const authController = new AuthController();

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), authController.login);

// POST /api/auth/register
router.post('/register', validateRequest(registerSchema), authController.register);

// POST /api/auth/refresh
router.post('/refresh', validateRequest(refreshTokenSchema), authController.refreshToken);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', authController.resetPassword);

export default router;

