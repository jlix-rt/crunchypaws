import { Router } from 'express';
import { PosController } from '../controllers/PosController';
import { authenticateToken, requireEmployee } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { openSessionSchema, closeSessionSchema } from '../validators/posSchemas';

const router = Router();
const posController = new PosController();

// POST /api/pos/sessions/open
router.post('/sessions/open', authenticateToken, requireEmployee, validateRequest(openSessionSchema), posController.openSession);

// POST /api/pos/sessions/close
router.post('/sessions/close', authenticateToken, requireEmployee, validateRequest(closeSessionSchema), posController.closeSession);

// GET /api/pos/sessions/current
router.get('/sessions/current', authenticateToken, requireEmployee, posController.getCurrentSession);

// GET /api/pos/sessions/history
router.get('/sessions/history', authenticateToken, requireEmployee, posController.getSessionHistory);

// POST /api/pos/sessions/:id/discrepancy
router.post('/sessions/:id/discrepancy', authenticateToken, requireEmployee, posController.addDiscrepancy);

export default router;



