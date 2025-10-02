import { Router } from 'express';
import { CouponController } from '@/controllers/CouponController';
import { validateBody } from '@/middleware/validation';
import { couponValidationSchema } from '@/utils/validation';

const router = Router();
const couponController = new CouponController();

// Rutas públicas
router.post('/validate', validateBody(couponValidationSchema), couponController.validateCoupon);
router.get('/active', couponController.getActiveCoupons);
router.get('/:code', couponController.getCouponByCode);

export default router;
