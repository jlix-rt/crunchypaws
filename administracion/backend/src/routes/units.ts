import { Router } from 'express';
import { UnitController } from '../controllers/UnitController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const unitController = new UnitController();

// Rutas de unidades
router.get('/', authenticateToken, requireAdmin, unitController.getUnits.bind(unitController));
router.get('/active', authenticateToken, requireAdmin, unitController.getActiveUnits.bind(unitController));
router.get('/:id', authenticateToken, requireAdmin, unitController.getUnitById.bind(unitController));
router.post('/', authenticateToken, requireAdmin, unitController.createUnit.bind(unitController));
router.put('/:id', authenticateToken, requireAdmin, unitController.updateUnit.bind(unitController));
router.delete('/:id', authenticateToken, requireAdmin, unitController.deleteUnit.bind(unitController));

export default router;
