import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

// Rutas del dashboard
router.get('/stats', authenticateToken, requireAdmin, dashboardController.getStats);
router.get('/charts', authenticateToken, requireAdmin, dashboardController.getCharts);

export default router;