import { Request, Response } from 'express';

export class DashboardController {
  // Obtener estadísticas del dashboard
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = {
        totalUsers: 1250,
        totalProducts: 45,
        totalSupplies: 120,
        totalOrders: 150,
        revenue: 25000,
        growth: {
          users: 12.5,
          products: 8.3,
          revenue: 15.2
        }
      };

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener gráficos del dashboard
  async getCharts(req: Request, res: Response): Promise<void> {
    try {
      const charts = {
        revenue: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          data: [12000, 15000, 18000, 22000, 20000, 25000]
        },
        orders: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          data: [45, 52, 48, 61, 55, 67]
        }
      };

      res.json({
        success: true,
        data: { charts }
      });
    } catch (error) {
      console.error('Error obteniendo gráficos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}



