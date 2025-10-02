import { Router } from 'express';
import { ProductController } from '@/controllers/ProductController';
import { validateQuery } from '@/middleware/validation';
import { paginationSchema, productFiltersSchema } from '@/utils/validation';

const router = Router();
const productController = new ProductController();

// Rutas públicas
router.get('/', validateQuery(paginationSchema.merge(productFiltersSchema)), productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', validateQuery(paginationSchema), productController.searchProducts);
router.get('/category/:categorySlug', validateQuery(paginationSchema.merge(productFiltersSchema)), productController.getProductsByCategory);
router.get('/:slug', productController.getProductBySlug);

// Rutas para verificación de stock
router.post('/check-stock', productController.checkStock);

export default router;
