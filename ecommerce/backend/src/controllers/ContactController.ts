import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ResponseHelper } from '@/utils/response';
import { ContactData } from '@/utils/validation';
import { logger } from '@/utils/logger';

const prisma = new PrismaClient();

export class ContactController {
  async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, message }: ContactData = req.body;

      // Guardar mensaje en la base de datos
      const contactMessage = await prisma.contactMessage.create({
        data: {
          name,
          email,
          message,
        },
      });

      // Log del mensaje para seguimiento
      logger.info('Nuevo mensaje de contacto recibido', {
        id: contactMessage.id,
        name,
        email,
        messageLength: message.length,
      });

      // En producción, aquí podrías:
      // 1. Enviar email de notificación al equipo
      // 2. Integrar con un sistema de tickets
      // 3. Enviar email de confirmación al usuario

      ResponseHelper.success(
        res,
        {
          id: contactMessage.id,
          createdAt: contactMessage.createdAt,
        },
        'Mensaje enviado exitosamente. Te contactaremos pronto.',
        201
      );
    } catch (error) {
      console.error('Error creando mensaje de contacto:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;

      const [messages, total] = await Promise.all([
        prisma.contactMessage.findMany({
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
        }),
        prisma.contactMessage.count(),
      ]);

      ResponseHelper.success(res, {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      });
    } catch (error) {
      console.error('Error obteniendo mensajes de contacto:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const messageId = parseInt(id);

      if (isNaN(messageId)) {
        ResponseHelper.error(res, 'ID de mensaje inválido');
        return;
      }

      const message = await prisma.contactMessage.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        ResponseHelper.notFound(res, 'Mensaje no encontrado');
        return;
      }

      ResponseHelper.success(res, message);
    } catch (error) {
      console.error('Error obteniendo mensaje de contacto:', error);
      ResponseHelper.serverError(res);
    }
  }

  async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const messageId = parseInt(id);

      if (isNaN(messageId)) {
        ResponseHelper.error(res, 'ID de mensaje inválido');
        return;
      }

      const message = await prisma.contactMessage.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        ResponseHelper.notFound(res, 'Mensaje no encontrado');
        return;
      }

      await prisma.contactMessage.delete({
        where: { id: messageId },
      });

      logger.info('Mensaje de contacto eliminado', { id: messageId });

      ResponseHelper.success(res, null, 'Mensaje eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando mensaje de contacto:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getContactStats(req: Request, res: Response): Promise<void> {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const [total, today_count, week_count, month_count] = await Promise.all([
        prisma.contactMessage.count(),
        prisma.contactMessage.count({
          where: { createdAt: { gte: startOfDay } },
        }),
        prisma.contactMessage.count({
          where: { createdAt: { gte: startOfWeek } },
        }),
        prisma.contactMessage.count({
          where: { createdAt: { gte: startOfMonth } },
        }),
      ]);

      ResponseHelper.success(res, {
        total,
        today: today_count,
        thisWeek: week_count,
        thisMonth: month_count,
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas de contacto:', error);
      ResponseHelper.serverError(res);
    }
  }
}
