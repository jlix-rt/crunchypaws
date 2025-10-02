import { NotificationService, MockWhatsAppProvider } from '../NotificationService';
import { PrismaClient } from '@prisma/client';
import { NotificationMessage } from '../../types';

// Mock Prisma
jest.mock('@prisma/client');

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    notificationService = new NotificationService();
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    jest.clearAllMocks();
  });

  describe('MockWhatsAppProvider', () => {
    it('should send mock message successfully', async () => {
      const provider = new MockWhatsAppProvider();
      const result = await provider.sendMessage('+50212345678', 'Test message');
      
      expect(result).toBe(true);
    });
  });

  describe('sendOrderNotification', () => {
    const mockNotification: NotificationMessage = {
      orderId: 1,
      customerName: 'Juan Pérez',
      customerPhone: '+50212345678',
      total: 150.50,
      paymentMethod: 'CASH',
      address: '5ta Avenida 12-34, Guatemala, Guatemala',
      items: [
        {
          name: 'Patitas de Pollo',
          quantity: 2,
          price: 25.50,
        },
        {
          name: 'Tráqueas de Res',
          quantity: 3,
          price: 35.00,
        },
      ],
    };

    it('should send notification when WhatsApp is enabled', async () => {
      // Mock config
      mockPrisma.config.findUnique = jest.fn().mockResolvedValue({
        value: {
          enabled: true,
          provider: 'mock',
          from: '+50200000000',
          to: '+50200000000',
          token: 'mock-token',
          namespace: 'crunchypaws',
        },
      });

      const result = await notificationService.sendOrderNotification(mockNotification);
      
      expect(result).toBe(true);
      expect(mockPrisma.config.findUnique).toHaveBeenCalledWith({
        where: {
          scope_key: {
            scope: 'whatsapp',
            key: 'settings',
          },
        },
      });
    });

    it('should return false when WhatsApp is disabled', async () => {
      mockPrisma.config.findUnique = jest.fn().mockResolvedValue({
        value: {
          enabled: false,
          provider: 'mock',
        },
      });

      const result = await notificationService.sendOrderNotification(mockNotification);
      
      expect(result).toBe(false);
    });

    it('should return false when config is not found', async () => {
      mockPrisma.config.findUnique = jest.fn().mockResolvedValue(null);

      const result = await notificationService.sendOrderNotification(mockNotification);
      
      expect(result).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      mockPrisma.config.findUnique = jest.fn().mockRejectedValue(new Error('Database error'));

      const result = await notificationService.sendOrderNotification(mockNotification);
      
      expect(result).toBe(false);
    });
  });

  describe('testConnection', () => {
    it('should test connection successfully', async () => {
      mockPrisma.config.findUnique = jest.fn().mockResolvedValue({
        value: {
          enabled: true,
          provider: 'mock',
          from: '+50200000000',
          to: '+50200000000',
          token: 'mock-token',
          namespace: 'crunchypaws',
        },
      });

      const result = await notificationService.testConnection();
      
      expect(result.success).toBe(true);
      expect(result.message).toBe('Mensaje de prueba enviado exitosamente');
    });

    it('should return error when WhatsApp is disabled', async () => {
      mockPrisma.config.findUnique = jest.fn().mockResolvedValue({
        value: {
          enabled: false,
        },
      });

      const result = await notificationService.testConnection();
      
      expect(result.success).toBe(false);
      expect(result.message).toBe('Notificaciones WhatsApp deshabilitadas');
    });
  });
});
