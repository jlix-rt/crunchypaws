import { Request, Response } from 'express';

export class ReviewController {
  // Obtener todas las reseñas
  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const mockReviews = [
        {
          id: 1,
          productId: 1,
          userId: 1,
          rating: 5,
          comment: 'Excelente producto',
          status: 'approved',
          createdAt: new Date().toISOString()
        }
      ];

      res.json({
        success: true,
        data: {
          reviews: mockReviews,
          pagination: {
            page: 1,
            limit: 10,
            total: mockReviews.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo reseñas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}



