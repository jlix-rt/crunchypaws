import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ResponseHelper } from '@/utils/response';

const prisma = new PrismaClient();

export class PaymentController {
  async getPaymentMethods(req: Request, res: Response): Promise<void> {
    try {
      const paymentMethods = await prisma.paymentMethod.findMany({
        where: { enabled: true },
        orderBy: { id: 'asc' },
      });

      ResponseHelper.success(res, paymentMethods);
    } catch (error) {
      console.error('Error obteniendo métodos de pago:', error);
      ResponseHelper.serverError(res);
    }
  }

  async createPaymentIntent(req: Request, res: Response): Promise<void> {
    try {
      const { amount, paymentMethod, orderId } = req.body;

      if (!amount || !paymentMethod) {
        ResponseHelper.error(res, 'Monto y método de pago son requeridos');
        return;
      }

      // Simulación de intención de pago para desarrollo
      const paymentIntent = {
        id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat(amount),
        currency: 'GTQ',
        paymentMethod,
        status: 'requires_confirmation',
        orderId,
        clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      // En producción, aquí integrarías con el procesador de pagos real
      switch (paymentMethod) {
        case 'CARD':
          // Integración con Stripe, Visa Direct, etc.
          paymentIntent.status = 'requires_confirmation';
          break;
        
        case 'CASH':
          // Pago contra entrega - marcar como pendiente
          paymentIntent.status = 'pending_cash_delivery';
          break;
        
        case 'TRANSFER':
          // Transferencia bancaria - proporcionar datos bancarios
          paymentIntent.status = 'pending_transfer';
          paymentIntent.bankInfo = {
            bank: 'Banco Industrial',
            account: '123-456789-0',
            name: 'CrunchyPaws S.A.',
            reference: `ORDER-${orderId}`,
          };
          break;
        
        default:
          ResponseHelper.error(res, 'Método de pago no soportado');
          return;
      }

      ResponseHelper.success(res, paymentIntent, 'Intención de pago creada');
    } catch (error) {
      console.error('Error creando intención de pago:', error);
      ResponseHelper.serverError(res);
    }
  }

  async confirmPayment(req: Request, res: Response): Promise<void> {
    try {
      const { paymentIntentId, paymentMethodId } = req.body;

      if (!paymentIntentId) {
        ResponseHelper.error(res, 'ID de intención de pago requerido');
        return;
      }

      // Simulación de confirmación de pago
      const confirmedPayment = {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 0, // En producción, obtener del procesador
        currency: 'GTQ',
        paymentMethod: paymentMethodId,
        confirmedAt: new Date().toISOString(),
      };

      // En producción, aquí confirmarías el pago con el procesador real
      // y actualizarías el estado de la orden en la base de datos

      ResponseHelper.success(res, confirmedPayment, 'Pago confirmado exitosamente');
    } catch (error) {
      console.error('Error confirmando pago:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { paymentIntentId } = req.params;

      // Simulación de consulta de estado de pago
      const paymentStatus = {
        id: paymentIntentId,
        status: 'succeeded', // En producción, consultar estado real
        amount: 0,
        currency: 'GTQ',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      ResponseHelper.success(res, paymentStatus);
    } catch (error) {
      console.error('Error obteniendo estado de pago:', error);
      ResponseHelper.serverError(res);
    }
  }

  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      // Webhook para recibir notificaciones del procesador de pagos
      const { type, data } = req.body;

      console.log('Webhook recibido:', { type, data });

      // En producción, aquí procesarías los diferentes tipos de eventos:
      // - payment_intent.succeeded
      // - payment_intent.payment_failed
      // - etc.

      switch (type) {
        case 'payment_intent.succeeded':
          // Actualizar orden como pagada
          console.log('Pago exitoso:', data);
          break;
        
        case 'payment_intent.payment_failed':
          // Manejar pago fallido
          console.log('Pago fallido:', data);
          break;
        
        default:
          console.log('Evento no manejado:', type);
      }

      ResponseHelper.success(res, { received: true });
    } catch (error) {
      console.error('Error procesando webhook:', error);
      ResponseHelper.serverError(res);
    }
  }
}
