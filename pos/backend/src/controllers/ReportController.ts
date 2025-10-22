import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Order, OrderSource } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { PosSession } from '../entities/PosSession';
import { AuthRequest } from '../middleware/auth';
import { CustomError, asyncHandler } from '../middleware/errorHandler';

export class ReportController {
  private orderRepository = AppDataSource.getRepository(Order);
  private orderItemRepository = AppDataSource.getRepository(OrderItem);
  private sessionRepository = AppDataSource.getRepository(PosSession);

  getDailyReport = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { date } = req.query;
    const employeeId = req.user!.id;

    const reportDate = date ? new Date(date as string) : new Date();
    const startDate = new Date(reportDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(reportDate);
    endDate.setHours(23, 59, 59, 999);

    // Obtener pedidos del día
    const orders = await this.orderRepository.find({
      where: {
        source: OrderSource.POS,
        created_at: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
      relations: ['items', 'payments'],
    });

    // Calcular estadísticas
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalItems = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.qty, 0), 0
    );

    // Productos más vendidos
    const productSales = await this.orderItemRepository
      .createQueryBuilder('oi')
      .leftJoin('oi.order', 'order')
      .leftJoin('oi.product', 'product')
      .select([
        'product.name as product_name',
        'product.sku as product_sku',
        'SUM(oi.qty) as total_quantity',
        'SUM(oi.final_line_total) as total_sales'
      ])
      .where('order.source = :source', { source: OrderSource.POS })
      .andWhere('order.created_at >= :startDate', { startDate })
      .andWhere('order.created_at <= :endDate', { endDate })
      .groupBy('oi.product_id')
      .orderBy('total_quantity', 'DESC')
      .limit(10)
      .getRawMany();

    res.json({
      message: 'Reporte diario obtenido exitosamente',
      data: {
        date: reportDate.toISOString().split('T')[0],
        summary: {
          total_orders: totalOrders,
          total_sales: totalSales,
          total_items: totalItems,
          average_order_value: totalOrders > 0 ? totalSales / totalOrders : 0,
        },
        top_products: productSales,
        orders: orders,
      },
    });
  });

  getEmployeeReport = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { start_date, end_date, employee_id } = req.query;
    const currentEmployeeId = req.user!.id;
    const targetEmployeeId = employee_id ? parseInt(employee_id as string) : currentEmployeeId;

    const startDate = start_date ? new Date(start_date as string) : new Date();
    const endDate = end_date ? new Date(end_date as string) : new Date();

    // Obtener sesiones del empleado
    const sessions = await this.sessionRepository.find({
      where: {
        employee_id: targetEmployeeId,
        opened_at: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
      relations: ['employee'],
    });

    // Obtener pedidos del empleado (simplificado - en producción se trackearía el empleado)
    const orders = await this.orderRepository.find({
      where: {
        source: OrderSource.POS,
        created_at: {
          $gte: startDate,
          $lte: endDate,
        } as any,
      },
      relations: ['items'],
    });

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalSessions = sessions.length;
    const totalHours = sessions.reduce((sum, session) => {
      if (session.closed_at) {
        const duration = session.closed_at.getTime() - session.opened_at.getTime();
        return sum + (duration / (1000 * 60 * 60)); // Convertir a horas
      }
      return sum;
    }, 0);

    res.json({
      message: 'Reporte de empleado obtenido exitosamente',
      data: {
        employee_id: targetEmployeeId,
        period: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        },
        summary: {
          total_sessions: totalSessions,
          total_hours: Math.round(totalHours * 100) / 100,
          total_sales: totalSales,
          average_session_sales: totalSessions > 0 ? totalSales / totalSessions : 0,
        },
        sessions: sessions,
      },
    });
  });

  getProductReport = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { start_date, end_date } = req.query;

    const startDate = start_date ? new Date(start_date as string) : new Date();
    const endDate = end_date ? new Date(end_date as string) : new Date();

    const productSales = await this.orderItemRepository
      .createQueryBuilder('oi')
      .leftJoin('oi.order', 'order')
      .leftJoin('oi.product', 'product')
      .leftJoin('product.category', 'category')
      .select([
        'product.id as product_id',
        'product.name as product_name',
        'product.sku as product_sku',
        'category.name as category_name',
        'SUM(oi.qty) as total_quantity',
        'SUM(oi.final_line_total) as total_sales',
        'AVG(oi.unit_price) as average_price'
      ])
      .where('order.source = :source', { source: OrderSource.POS })
      .andWhere('order.created_at >= :startDate', { startDate })
      .andWhere('order.created_at <= :endDate', { endDate })
      .groupBy('oi.product_id')
      .orderBy('total_sales', 'DESC')
      .getRawMany();

    res.json({
      message: 'Reporte de productos obtenido exitosamente',
      data: {
        period: {
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        },
        products: productSales,
      },
    });
  });

  exportReport = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { format = 'json' } = req.query;

    // En una implementación real, aquí se generaría el archivo en el formato solicitado
    // Por ahora solo retornamos un mensaje
    res.json({
      message: `Reporte exportado en formato ${format}`,
      data: {
        format,
        download_url: `/api/reports/download/${Date.now()}.${format}`,
      },
    });
  });
}



