import { Request, Response } from 'express';

export class PromotionController {
  // Obtener todas las promociones
  async getPromotions(req: Request, res: Response): Promise<void> {
    try {
      const mockPromotions = [
        {
          id: 1,
          name: 'Descuento 20%',
          description: 'Descuento en todos los productos',
          discount: 20,
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      res.json({
        success: true,
        data: {
          promotions: mockPromotions,
          pagination: {
            page: 1,
            limit: 10,
            total: mockPromotions.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo promociones:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}



