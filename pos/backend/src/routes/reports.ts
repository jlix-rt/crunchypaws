import { Router } from 'express';
import { ReportController } from '../controllers/ReportController';
import { authenticateToken, requireEmployee } from '../middleware/auth';
import { validateQuery } from '../middleware/validation';
import { reportQuerySchema } from '../validators/reportSchemas';

const router = Router();
const reportController = new ReportController();

// GET /api/reports/daily
router.get('/daily', authenticateToken, requireEmployee, validateQuery(reportQuerySchema), reportController.getDailyReport);

// GET /api/reports/employee
router.get('/employee', authenticateToken, requireEmployee, validateQuery(reportQuerySchema), reportController.getEmployeeReport);

// GET /api/reports/products
router.get('/products', authenticateToken, requireEmployee, validateQuery(reportQuerySchema), reportController.getProductReport);

// GET /api/reports/export
router.get('/export', authenticateToken, requireEmployee, validateQuery(reportQuerySchema), reportController.exportReport);

export default router;



