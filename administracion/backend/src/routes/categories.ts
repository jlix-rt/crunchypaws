import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const categoryController = new CategoryController();

// Rutas de categorías
router.get('/', authenticateToken, requireAdmin, categoryController.getCategories.bind(categoryController));
router.get('/:id', authenticateToken, requireAdmin, categoryController.getCategoryById.bind(categoryController));
router.post('/', authenticateToken, requireAdmin, categoryController.createCategory.bind(categoryController));
router.put('/:id', authenticateToken, requireAdmin, categoryController.updateCategory.bind(categoryController));
router.delete('/:id', authenticateToken, requireAdmin, categoryController.deleteCategory.bind(categoryController));

export default router;