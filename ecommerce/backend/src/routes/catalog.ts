import { Router } from 'express';
import { CatalogController } from '../controllers/CatalogController';
import { validateRequest } from '../middleware/validation';
import { searchSchema } from '../validators/catalogSchemas';

const router = Router();
const catalogController = new CatalogController();

// GET /api/catalog/categories
router.get('/categories', catalogController.getCategories);

// GET /api/catalog/categories/:id
router.get('/categories/:id', catalogController.getCategoryById);

// GET /api/catalog/products
router.get('/products', catalogController.getProducts);

// GET /api/catalog/products/:id
router.get('/products/:id', catalogController.getProductById);

// GET /api/catalog/products/slug/:slug
router.get('/products/slug/:slug', catalogController.getProductBySlug);

// GET /api/catalog/search
router.get('/search', validateRequest(searchSchema), catalogController.searchProducts);

// GET /api/catalog/autocomplete
router.get('/autocomplete', catalogController.autocomplete);

// GET /api/catalog/featured
router.get('/featured', catalogController.getFeaturedProducts);

// GET /api/catalog/related/:id
router.get('/related/:id', catalogController.getRelatedProducts);

export default router;

