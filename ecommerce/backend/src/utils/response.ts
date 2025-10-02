import { Response } from 'express';
import { ApiResponse } from '@/types';

export class ResponseHelper {
  static success<T>(res: Response, data?: T, message?: string, statusCode = 200): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string,
    statusCode = 400,
    errors?: Record<string, string[]>
  ): Response {
    const response: ApiResponse = {
      success: false,
      error,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  static validationError(
    res: Response,
    errors: Record<string, string[]>,
    message = 'Errores de validación'
  ): Response {
    return this.error(res, message, 422, errors);
  }

  static notFound(res: Response, message = 'Recurso no encontrado'): Response {
    return this.error(res, message, 404);
  }

  static unauthorized(res: Response, message = 'No autorizado'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Acceso denegado'): Response {
    return this.error(res, message, 403);
  }

  static serverError(res: Response, message = 'Error interno del servidor'): Response {
    return this.error(res, message, 500);
  }
}

export const createPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
};
