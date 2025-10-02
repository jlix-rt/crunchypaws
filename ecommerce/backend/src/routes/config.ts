import { Router } from 'express';
import { ConfigController } from '@/controllers/ConfigController';
import { validateBody } from '@/middleware/validation';
import { whatsappConfigSchema } from '@/utils/validation';

const router = Router();
const configController = new ConfigController();

// En producción, estas rutas deberían tener autenticación de admin
// Por ahora, las dejamos abiertas para desarrollo

// Configuración de WhatsApp
router.get('/whatsapp', configController.getWhatsAppConfig);
router.put('/whatsapp', validateBody(whatsappConfigSchema), configController.updateWhatsAppConfig);
router.post('/whatsapp/test', configController.testWhatsAppConnection);

// Configuración general
router.get('/general', configController.getGeneralConfig);
router.put('/general', configController.updateGeneralConfig);
router.delete('/general/:scope/:key', configController.deleteConfig);

export default router;
