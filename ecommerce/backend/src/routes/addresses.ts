import { Router } from 'express';
import { AddressController } from '@/controllers/AddressController';
import { validateBody } from '@/middleware/validation';
import { authenticateToken } from '@/middleware/auth';
import { addressSchema } from '@/utils/validation';

const router = Router();
const addressController = new AddressController();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

router.get('/', addressController.getAddresses);
router.get('/:id', addressController.getAddress);
router.post('/', validateBody(addressSchema), addressController.createAddress);
router.put('/:id', validateBody(addressSchema), addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.patch('/:id/default', addressController.setDefaultAddress);

export default router;
