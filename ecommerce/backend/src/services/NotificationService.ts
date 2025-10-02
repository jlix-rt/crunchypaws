import { PrismaClient } from '@prisma/client';
import { WhatsAppConfig, NotificationMessage } from '@/types';
import { logger } from '@/utils/logger';

const prisma = new PrismaClient();

// Interfaz base para proveedores de WhatsApp
export interface WhatsAppProvider {
  sendMessage(to: string, message: string): Promise<boolean>;
}

// Implementación mock para desarrollo
export class MockWhatsAppProvider implements WhatsAppProvider {
  async sendMessage(to: string, message: string): Promise<boolean> {
    logger.info('📱 Mock WhatsApp enviado', { to, message });
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  }
}

// Implementación con Twilio
export class TwilioWhatsAppProvider implements WhatsAppProvider {
  private client: any;

  constructor(private config: WhatsAppConfig) {
    // Solo importar Twilio si se va a usar
    const twilio = require('twilio');
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      await this.client.messages.create({
        body: message,
        from: `whatsapp:${this.config.from}`,
        to: `whatsapp:${to}`,
      });
      
      logger.info('📱 WhatsApp enviado via Twilio', { to });
      return true;
    } catch (error) {
      logger.error('Error enviando WhatsApp via Twilio', { error, to });
      return false;
    }
  }
}

// Implementación con Meta WhatsApp Business API
export class MetaWhatsAppProvider implements WhatsAppProvider {
  constructor(private config: WhatsAppConfig) {}

  async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      const axios = require('axios');
      
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to.replace('+', ''),
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      logger.info('📱 WhatsApp enviado via Meta', { to, messageId: response.data.messages[0].id });
      return true;
    } catch (error) {
      logger.error('Error enviando WhatsApp via Meta', { error, to });
      return false;
    }
  }
}

export class NotificationService {
  private provider: WhatsAppProvider | null = null;

  private async getConfig(): Promise<WhatsAppConfig | null> {
    try {
      const config = await prisma.config.findUnique({
        where: {
          scope_key: {
            scope: 'whatsapp',
            key: 'settings',
          },
        },
      });

      return config?.value as WhatsAppConfig || null;
    } catch (error) {
      logger.error('Error obteniendo configuración de WhatsApp', { error });
      return null;
    }
  }

  private async initializeProvider(): Promise<void> {
    const config = await this.getConfig();
    
    if (!config || !config.enabled) {
      this.provider = null;
      return;
    }

    switch (config.provider) {
      case 'twilio':
        this.provider = new TwilioWhatsAppProvider(config);
        break;
      case 'meta':
        this.provider = new MetaWhatsAppProvider(config);
        break;
      case 'mock':
      default:
        this.provider = new MockWhatsAppProvider();
        break;
    }
  }

  private formatOrderMessage(notification: NotificationMessage): string {
    const itemsList = notification.items
      .map(item => `• ${item.name} x${item.quantity} - Q${item.price.toFixed(2)}`)
      .join('\n');

    return `🐾 *Nueva orden - CrunchyPaws*

📋 *Orden #${notification.orderId}*
👤 *Cliente:* ${notification.customerName}
📞 *Teléfono:* ${notification.customerPhone}
💰 *Total:* Q${notification.total.toFixed(2)}
💳 *Pago:* ${notification.paymentMethod}

📦 *Productos:*
${itemsList}

📍 *Dirección:*
${notification.address}

¡Gracias por confiar en CrunchyPaws! 🐕🐱`;
  }

  async sendOrderNotification(notification: NotificationMessage): Promise<boolean> {
    try {
      await this.initializeProvider();

      if (!this.provider) {
        logger.info('Notificaciones WhatsApp deshabilitadas');
        return false;
      }

      const config = await this.getConfig();
      if (!config) {
        logger.error('No se pudo obtener configuración de WhatsApp');
        return false;
      }

      const message = this.formatOrderMessage(notification);
      const success = await this.provider.sendMessage(config.to, message);

      if (success) {
        logger.info('Notificación de orden enviada exitosamente', { orderId: notification.orderId });
      } else {
        logger.error('Error enviando notificación de orden', { orderId: notification.orderId });
      }

      return success;
    } catch (error) {
      logger.error('Error en servicio de notificaciones', { error, orderId: notification.orderId });
      return false;
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.initializeProvider();

      if (!this.provider) {
        return { success: false, message: 'Notificaciones WhatsApp deshabilitadas' };
      }

      const config = await this.getConfig();
      if (!config) {
        return { success: false, message: 'Configuración no encontrada' };
      }

      const testMessage = `🧪 Mensaje de prueba de CrunchyPaws\n\nFecha: ${new Date().toLocaleString('es-GT')}\nProvider: ${config.provider}`;
      const success = await this.provider.sendMessage(config.to, testMessage);

      return {
        success,
        message: success ? 'Mensaje de prueba enviado exitosamente' : 'Error enviando mensaje de prueba',
      };
    } catch (error) {
      logger.error('Error en prueba de conexión WhatsApp', { error });
      return { success: false, message: 'Error en prueba de conexión' };
    }
  }
}
