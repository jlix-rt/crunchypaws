import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const productController = new ProductController();

// Rutas de productos
router.get('/', authenticateToken, requireAdmin, productController.getProducts);
router.post('/', authenticateToken, requireAdmin, productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

export default router;