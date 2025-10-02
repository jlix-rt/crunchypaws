import { Router } from 'express';
import { ContactController } from '@/controllers/ContactController';
import { validateBody } from '@/middleware/validation';
import { contactLimiter } from '@/middleware/rateLimit';
import { contactSchema } from '@/utils/validation';

const router = Router();
const contactController = new ContactController();

// Crear mensaje de contacto (con rate limiting)
router.post('/', contactLimiter, validateBody(contactSchema), contactController.createMessage);

// Rutas administrativas (en producción, agregar autenticación admin)
router.get('/', contactController.getMessages);
router.get('/stats', contactController.getContactStats);
router.get('/:id', contactController.getMessage);
router.delete('/:id', contactController.deleteMessage);

export default router;
