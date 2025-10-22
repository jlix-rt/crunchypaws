import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticateToken, requireEmployee } from '../middleware/auth';
import { validateQuery } from '../middleware/validation';
import { searchProductSchema } from '../validators/productSchemas';

const router = Router();
const productController = new ProductController();

// GET /api/products/search
router.get('/search', authenticateToken, requireEmployee, validateQuery(searchProductSchema), productController.searchProduct);

// GET /api/products/barcode/:code
router.get('/barcode/:code', authenticateToken, requireEmployee, productController.getProductByBarcode);

// GET /api/products/:id/prices
router.get('/:id/prices', authenticateToken, requireEmployee, productController.getProductPrices);

// GET /api/price-lists
router.get('/price-lists', authenticateToken, requireEmployee, productController.getPriceLists);

export default router;



