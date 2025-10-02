import { Request, Response } from 'express';
import { OrderRepository } from '@/repositories/OrderRepository';
import { ProductRepository } from '@/repositories/ProductRepository';
import { CouponRepository } from '@/repositories/CouponRepository';
import { UserRepository } from '@/repositories/UserRepository';
import { NotificationService } from '@/services/NotificationService';
import { ResponseHelper } from '@/utils/response';
import { AuthenticatedRequest, OrderCreateData, NotificationMessage } from '@/types';
import { OrderData } from '@/utils/validation';

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const couponRepository = new CouponRepository();
const userRepository = new UserRepository();
const notificationService = new NotificationService();

export class OrderController {
  async createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const orderData: OrderData = req.body;
      const userId = req.user?.id;

      // Validar que si hay usuario, tenga teléfono
      if (userId) {
        const user = await userRepository.findById(userId);
        if (!user?.telefono) {
          ResponseHelper.error(res, 'Debe completar su número de teléfono antes de realizar el pedido', 400);
          return;
        }
      }

      // Validar stock
      const stockAvailable = await productRepository.checkStock(orderData.items);
      if (!stockAvailable) {
        ResponseHelper.error(res, 'Stock insuficiente para algunos productos', 409);
        return;
      }

      // Calcular totales
      const products = await productRepository.findByIds(
        orderData.items.map(item => item.productId)
      );

      let subtotal = 0;
      for (const item of orderData.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) {
          ResponseHelper.error(res, `Producto con ID ${item.productId} no encontrado`);
          return;
        }
        subtotal += product.price.toNumber() * item.quantity;
      }

      // Aplicar cupón si existe
      let discount = 0;
      let couponApplied = '';
      if (orderData.couponCode) {
        const couponValidation = await couponRepository.validateCoupon(
          orderData.couponCode,
          subtotal
        );

        if (!couponValidation.valid) {
          ResponseHelper.error(res, couponValidation.message);
          return;
        }

        discount = couponValidation.discount;
        couponApplied = orderData.couponCode;
      }

      const total = subtotal - discount;

      // Crear orden
      const createData: OrderCreateData = {
        userId,
        addressId: orderData.addressId,
        customer: orderData.customer,
        items: orderData.items,
        paymentMethod: orderData.paymentMethod,
        couponCode: orderData.couponCode,
      };

      const order = await orderRepository.create(createData, {
        subtotal,
        discount,
        total,
      });

      // Enviar notificación WhatsApp si el usuario está logueado y tiene teléfono
      if (userId && req.user?.telefono) {
        const notificationData: NotificationMessage = {
          orderId: order.id,
          customerName: order.customerName,
          customerPhone: order.phone,
          total: order.total.toNumber(),
          paymentMethod: order.paymentMethod,
          address: `${order.shipToLine1}, ${order.shipToMunicipio}, ${order.shipToDepartamento}`,
          items: order.items.map(item => ({
            name: item.nameSnapshot,
            quantity: item.quantity,
            price: item.priceSnapshot.toNumber(),
          })),
        };

        // Enviar notificación de forma asíncrona (no bloquear la respuesta)
        notificationService.sendOrderNotification(notificationData).catch(error => {
          console.error('Error enviando notificación WhatsApp:', error);
        });
      }

      ResponseHelper.success(res, {
        order,
        couponApplied,
        totals: {
          subtotal,
          discount,
          total,
        },
      }, 'Orden creada exitosamente', 201);
    } catch (error) {
      console.error('Error creando orden:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const orderId = parseInt(id);

      if (isNaN(orderId)) {
        ResponseHelper.error(res, 'ID de orden inválido');
        return;
      }

      const order = await orderRepository.findById(orderId);
      if (!order) {
        ResponseHelper.notFound(res, 'Orden no encontrada');
        return;
      }

      ResponseHelper.success(res, order);
    } catch (error) {
      console.error('Error obteniendo orden:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getUserOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      const offset = (page - 1) * limit;

      const orders = await orderRepository.findByUserId(req.user.id, limit, offset);

      ResponseHelper.success(res, {
        orders,
        pagination: {
          page,
          limit,
          hasMore: orders.length === limit,
        },
      });
    } catch (error) {
      console.error('Error obteniendo órdenes del usuario:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getOrderStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const stats = await orderRepository.getOrderStats(userId);

      ResponseHelper.success(res, stats);
    } catch (error) {
      console.error('Error obteniendo estadísticas de órdenes:', error);
      ResponseHelper.serverError(res);
    }
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const orderId = parseInt(id);

      if (isNaN(orderId)) {
        ResponseHelper.error(res, 'ID de orden inválido');
        return;
      }

      if (!['PENDING', 'PAID', 'CANCELLED'].includes(status)) {
        ResponseHelper.error(res, 'Estado de orden inválido');
        return;
      }

      const order = await orderRepository.updateStatus(orderId, status);
      ResponseHelper.success(res, order, 'Estado de orden actualizado');
    } catch (error) {
      console.error('Error actualizando estado de orden:', error);
      ResponseHelper.serverError(res);
    }
  }
}
