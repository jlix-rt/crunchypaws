import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Rutas de usuarios
router.get('/', authenticateToken, requireAdmin, userController.getUsers);
router.get('/:id', authenticateToken, requireAdmin, userController.getUserById);
router.post('/', authenticateToken, requireAdmin, userController.createUser);
router.put('/:id', authenticateToken, requireAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, requireAdmin, userController.deleteUser);

export default router;