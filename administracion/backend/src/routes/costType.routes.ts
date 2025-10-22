import { Router } from 'express';
import { CostTypeController } from '../controllers/CostTypeController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';

const router = Router();
const costTypeController = new CostTypeController();

// Aplicar autenticación y autorización de admin a todas las rutas
router.use(authenticateToken);
router.use(requireAdmin);

// Rutas CRUD para tipos de costos
router.get('/', costTypeController.getCostTypes.bind(costTypeController));
router.get('/active', costTypeController.getActiveCostTypes.bind(costTypeController));
router.get('/:id', costTypeController.getCostTypeById.bind(costTypeController));
router.post('/', costTypeController.createCostType.bind(costTypeController));
router.put('/:id', costTypeController.updateCostType.bind(costTypeController));
router.delete('/:id', costTypeController.deleteCostType.bind(costTypeController));

export default router;

