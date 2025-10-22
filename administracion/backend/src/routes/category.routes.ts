import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();
const categoryController = new CategoryController();

// Rutas para categorías
router.get('/', categoryController.getCategories.bind(categoryController));
router.get('/:id', categoryController.getCategoryById.bind(categoryController));
router.post('/', categoryController.createCategory.bind(categoryController));
router.put('/:id', categoryController.updateCategory.bind(categoryController));
router.delete('/:id', categoryController.deleteCategory.bind(categoryController));

export default router;
