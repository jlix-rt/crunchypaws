import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { PosSession } from '../entities/PosSession';
import { PosDiscrepancy } from '../entities/PosDiscrepancy';
import { AuthRequest } from '../middleware/auth';
import { CustomError, asyncHandler } from '../middleware/errorHandler';

export class PosController {
  private sessionRepository = AppDataSource.getRepository(PosSession);
  private discrepancyRepository = AppDataSource.getRepository(PosDiscrepancy);

  openSession = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { opening_amount } = req.body;
    const employeeId = req.user!.id;

    // Verificar si ya hay una sesión abierta
    const existingSession = await this.sessionRepository.findOne({
      where: { 
        employee_id: employeeId,
        closed_at: null 
      },
    });

    if (existingSession) {
      throw new CustomError('Ya existe una sesión abierta', 400);
    }

    // Crear nueva sesión
    const session = this.sessionRepository.create({
      employee_id: employeeId,
      opening_amount,
    });

    const savedSession = await this.sessionRepository.save(session);

    res.status(201).json({
      message: 'Sesión abierta exitosamente',
      data: savedSession,
    });
  });

  closeSession = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { closing_amount } = req.body;
    const employeeId = req.user!.id;

    // Buscar sesión abierta
    const session = await this.sessionRepository.findOne({
      where: { 
        employee_id: employeeId,
        closed_at: null 
      },
    });

    if (!session) {
      throw new CustomError('No hay sesión abierta', 400);
    }

    // Cerrar sesión
    session.closing_amount = closing_amount;
    session.closed_at = new Date();

    const updatedSession = await this.sessionRepository.save(session);

    res.json({
      message: 'Sesión cerrada exitosamente',
      data: updatedSession,
    });
  });

  getCurrentSession = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const employeeId = req.user!.id;

    const session = await this.sessionRepository.findOne({
      where: { 
        employee_id: employeeId,
        closed_at: null 
      },
      relations: ['employee', 'discrepancies'],
    });

    if (!session) {
      return res.json({
        message: 'No hay sesión abierta',
        data: null,
      });
    }

    res.json({
      message: 'Sesión actual obtenida exitosamente',
      data: session,
    });
  });

  getSessionHistory = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const employeeId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const [sessions, total] = await this.sessionRepository.findAndCount({
      where: { employee_id: employeeId },
      relations: ['employee'],
      order: { opened_at: 'DESC' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    res.json({
      message: 'Historial de sesiones obtenido exitosamente',
      data: {
        sessions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  });

  addDiscrepancy = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const session = await this.sessionRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!session) {
      throw new CustomError('Sesión no encontrada', 404);
    }

    const discrepancy = this.discrepancyRepository.create({
      session_id: parseInt(id),
      amount,
      reason,
    });

    const savedDiscrepancy = await this.discrepancyRepository.save(discrepancy);

    res.status(201).json({
      message: 'Discrepancia registrada exitosamente',
      data: savedDiscrepancy,
    });
  });
}



