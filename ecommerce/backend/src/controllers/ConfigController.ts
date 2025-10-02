import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '@/services/NotificationService';
import { ResponseHelper } from '@/utils/response';
import { WhatsAppConfigData } from '@/utils/validation';
import { logger } from '@/utils/logger';

const prisma = new PrismaClient();
const notificationService = new NotificationService();

export class ConfigController {
  async getWhatsAppConfig(req: Request, res: Response): Promise<void> {
    try {
      const config = await prisma.config.findUnique({
        where: {
          scope_key: {
            scope: 'whatsapp',
            key: 'settings',
          },
        },
      });

      if (!config) {
        ResponseHelper.notFound(res, 'Configuración de WhatsApp no encontrada');
        return;
      }

      // No exponer tokens sensibles en la respuesta
      const safeConfig = {
        ...config.value as any,
        token: config.value && (config.value as any).token ? '***' : undefined,
      };

      ResponseHelper.success(res, safeConfig);
    } catch (error) {
      console.error('Error obteniendo configuración de WhatsApp:', error);
      ResponseHelper.serverError(res);
    }
  }

  async updateWhatsAppConfig(req: Request, res: Response): Promise<void> {
    try {
      const configData: WhatsAppConfigData = req.body;

      // Validar configuración específica del proveedor
      if (configData.provider === 'twilio' && !process.env.TWILIO_ACCOUNT_SID) {
        ResponseHelper.error(res, 'Configuración de Twilio incompleta en variables de entorno');
        return;
      }

      if (configData.provider === 'meta' && !process.env.META_ACCESS_TOKEN) {
        ResponseHelper.error(res, 'Configuración de Meta WhatsApp incompleta en variables de entorno');
        return;
      }

      // Actualizar o crear configuración
      const config = await prisma.config.upsert({
        where: {
          scope_key: {
            scope: 'whatsapp',
            key: 'settings',
          },
        },
        update: {
          value: configData,
        },
        create: {
          scope: 'whatsapp',
          key: 'settings',
          value: configData,
        },
      });

      logger.info('Configuración de WhatsApp actualizada', {
        provider: configData.provider,
        enabled: configData.enabled,
      });

      // Respuesta sin token sensible
      const safeConfig = {
        ...configData,
        token: configData.token ? '***' : undefined,
      };

      ResponseHelper.success(res, safeConfig, 'Configuración actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando configuración de WhatsApp:', error);
      ResponseHelper.serverError(res);
    }
  }

  async testWhatsAppConnection(req: Request, res: Response): Promise<void> {
    try {
      const result = await notificationService.testConnection();

      if (result.success) {
        ResponseHelper.success(res, result, 'Prueba de conexión exitosa');
      } else {
        ResponseHelper.error(res, result.message, 400);
      }
    } catch (error) {
      console.error('Error en prueba de conexión WhatsApp:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getGeneralConfig(req: Request, res: Response): Promise<void> {
    try {
      const configs = await prisma.config.findMany({
        where: {
          scope: { not: 'whatsapp' }, // Excluir configuración sensible de WhatsApp
        },
        orderBy: [
          { scope: 'asc' },
          { key: 'asc' },
        ],
      });

      // Agrupar por scope
      const groupedConfigs = configs.reduce((acc, config) => {
        if (!acc[config.scope]) {
          acc[config.scope] = {};
        }
        acc[config.scope][config.key] = config.value;
        return acc;
      }, {} as Record<string, any>);

      ResponseHelper.success(res, groupedConfigs);
    } catch (error) {
      console.error('Error obteniendo configuración general:', error);
      ResponseHelper.serverError(res);
    }
  }

  async updateGeneralConfig(req: Request, res: Response): Promise<void> {
    try {
      const { scope, key, value } = req.body;

      if (!scope || !key || value === undefined) {
        ResponseHelper.error(res, 'Scope, key y value son requeridos');
        return;
      }

      // Prevenir modificación de configuración sensible
      if (scope === 'whatsapp') {
        ResponseHelper.forbidden(res, 'Use el endpoint específico para configuración de WhatsApp');
        return;
      }

      const config = await prisma.config.upsert({
        where: {
          scope_key: { scope, key },
        },
        update: { value },
        create: { scope, key, value },
      });

      logger.info('Configuración general actualizada', { scope, key });

      ResponseHelper.success(res, config, 'Configuración actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando configuración general:', error);
      ResponseHelper.serverError(res);
    }
  }

  async deleteConfig(req: Request, res: Response): Promise<void> {
    try {
      const { scope, key } = req.params;

      // Prevenir eliminación de configuración crítica
      if (scope === 'whatsapp') {
        ResponseHelper.forbidden(res, 'No se puede eliminar configuración de WhatsApp');
        return;
      }

      const config = await prisma.config.findUnique({
        where: { scope_key: { scope, key } },
      });

      if (!config) {
        ResponseHelper.notFound(res, 'Configuración no encontrada');
        return;
      }

      await prisma.config.delete({
        where: { scope_key: { scope, key } },
      });

      logger.info('Configuración eliminada', { scope, key });

      ResponseHelper.success(res, null, 'Configuración eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando configuración:', error);
      ResponseHelper.serverError(res);
    }
  }
}
