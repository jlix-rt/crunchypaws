import { Router } from 'express';
import { CostBreakdownController } from '../controllers/CostBreakdownController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';

const router = Router();
const costBreakdownController = new CostBreakdownController();

// Aplicar autenticación y autorización de admin a todas las rutas
router.use(authenticateToken);
router.use(requireAdmin);

// Rutas CRUD para desgloses de costos
router.get('/', costBreakdownController.getCostBreakdowns.bind(costBreakdownController));
router.get('/:id', costBreakdownController.getCostBreakdownById.bind(costBreakdownController));
router.post('/', costBreakdownController.createCostBreakdown.bind(costBreakdownController));
router.put('/:id', costBreakdownController.updateCostBreakdown.bind(costBreakdownController));
router.delete('/:id', costBreakdownController.deleteCostBreakdown.bind(costBreakdownController));

// Ruta especial para obtener desgloses por producto
router.get('/product/:productId', costBreakdownController.getCostBreakdownsByProduct.bind(costBreakdownController));

// Ruta para obtener desglose dinámico de todos los productos
router.get('/dynamic/all', costBreakdownController.getDynamicCostBreakdowns.bind(costBreakdownController));

export default router;


