import { Router } from 'express';
import { SupplyController } from '../controllers/SupplyController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const supplyController = new SupplyController();

// Rutas de insumos
router.get('/', authenticateToken, requireAdmin, supplyController.getSupplies);
router.post('/', authenticateToken, requireAdmin, supplyController.createSupply);
router.put('/:id', authenticateToken, requireAdmin, supplyController.updateSupply);
router.delete('/:id', authenticateToken, requireAdmin, supplyController.deleteSupply);

export default router;