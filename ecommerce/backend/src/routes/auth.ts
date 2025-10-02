import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { validateBody } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { authLimiter } from '@/middleware/rateLimit';
import { registerSchema, loginSchema, updateProfileSchema } from '@/utils/validation';

const router = Router();
const authController = new AuthController();

// Aplicar rate limiting a todas las rutas de auth
router.use(authLimiter);

// Rutas públicas
router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);

// Rutas protegidas
router.get('/me', authenticateToken, authController.getProfile);
router.put('/me', authenticateToken, validateBody(updateProfileSchema), authController.updateProfile);
router.put('/change-password', authenticateToken, authController.changePassword);

export default router;
