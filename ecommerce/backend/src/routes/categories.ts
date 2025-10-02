import { Router } from 'express';
import { CategoryController } from '@/controllers/CategoryController';

const router = Router();
const categoryController = new CategoryController();

// Rutas públicas
router.get('/', categoryController.getCategories);
router.get('/root', categoryController.getRootCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.get('/:categoryId/subcategories', categoryController.getSubcategories);
router.get('/:categoryId/path', categoryController.getCategoryPath);

export default router;
