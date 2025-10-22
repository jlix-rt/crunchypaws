import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Order, OrderSource, OrderStatus } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Payment, PaymentStatus } from '../entities/Payment';
import { Product } from '../entities/Product';
import { AuthRequest } from '../middleware/auth';
import { CustomError, asyncHandler } from '../middleware/errorHandler';

export class OrderController {
  private orderRepository = AppDataSource.getRepository(Order);
  private orderItemRepository = AppDataSource.getRepository(OrderItem);
  private paymentRepository = AppDataSource.getRepository(Payment);
  private productRepository = AppDataSource.getRepository(Product);

  getOrders = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { date, page = 1, limit = 20 } = req.query;
    const employeeId = req.user!.id;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.payments', 'payments')
      .where('order.source = :source', { source: OrderSource.POS });

    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      queryBuilder.andWhere('order.created_at >= :startDate', { startDate })
                 .andWhere('order.created_at < :endDate', { endDate });
    }

    queryBuilder.orderBy('order.created_at', 'DESC')
                .skip((Number(page) - 1) * Number(limit))
                .take(Number(limit));

    const [orders, total] = await queryBuilder.getManyAndCount();

    res.json({
      message: 'Pedidos POS obtenidos exitosamente',
      data: {
        orders,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  });

  getOrderById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await this.orderRepository.findOne({
      where: { 
        id: parseInt(id),
        source: OrderSource.POS 
      },
      relations: ['items', 'payments', 'user'],
    });

    if (!order) {
      throw new CustomError('Pedido no encontrado', 404);
    }

    res.json({
      message: 'Pedido obtenido exitosamente',
      data: order,
    });
  });

  createOrder = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const orderData = req.body;
    const employeeId = req.user!.id;

    // Calcular totales
    let subtotal = 0;
    const orderItems = [];

    for (const item of orderData.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.product_id, is_active: true },
      });

      if (!product) {
        throw new CustomError(`Producto con ID ${item.product_id} no encontrado`, 404);
      }

      const lineTotal = item.quantity * item.unit_price;
      subtotal += lineTotal;

      orderItems.push({
        product_id: item.product_id,
        name: product.name,
        sku: product.sku,
        qty: item.quantity,
        unit_price: item.unit_price,
        discount_amount: 0,
        final_line_total: lineTotal,
      });
    }

    const discountTotal = orderData.discount_amount || 0;
    const total = subtotal - discountTotal;

    // Crear pedido
    const order = this.orderRepository.create({
      user_id: null, // Cliente anónimo en POS
      phone: orderData.customer_phone || '',
      email: orderData.customer_email || '',
      nit: orderData.customer_nit || null,
      subtotal,
      discount_total: discountTotal,
      shipping_price: 0,
      total,
      status: OrderStatus.CREATED,
      source: OrderSource.POS,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Crear items del pedido
    for (const item of orderItems) {
      const orderItem = this.orderItemRepository.create({
        order_id: savedOrder.id,
        ...item,
      });
      await this.orderItemRepository.save(orderItem);
    }

    // Crear pago
    const payment = this.paymentRepository.create({
      order_id: savedOrder.id,
      method_id: orderData.payment_method_id,
      amount: total,
      status: PaymentStatus.PAID,
      transaction_ref: `POS_${savedOrder.id}_${Date.now()}`,
    });

    await this.paymentRepository.save(payment);

    // Actualizar stock (simplificado)
    for (const item of orderData.items) {
      await this.productRepository.update(
        { id: item.product_id },
        { stock: () => `stock - ${item.quantity}` }
      );
    }

    // Obtener pedido completo
    const completeOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'payments'],
    });

    res.status(201).json({
      message: 'Pedido POS creado exitosamente',
      data: completeOrder,
    });
  });

  cancelOrder = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await this.orderRepository.findOne({
      where: { 
        id: parseInt(id),
        source: OrderSource.POS 
      },
    });

    if (!order) {
      throw new CustomError('Pedido no encontrado', 404);
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new CustomError('El pedido ya está cancelado', 400);
    }

    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);

    res.json({
      message: 'Pedido cancelado exitosamente',
      data: order,
    });
  });

  printTicket = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const order = await this.orderRepository.findOne({
      where: { 
        id: parseInt(id),
        source: OrderSource.POS 
      },
      relations: ['items', 'payments'],
    });

    if (!order) {
      throw new CustomError('Pedido no encontrado', 404);
    }

    // En una implementación real, aquí se enviaría a la impresora térmica
    // Por ahora solo retornamos los datos del ticket
    const ticketData = {
      order_id: order.id,
      date: order.created_at,
      items: order.items,
      subtotal: order.subtotal,
      discount_total: order.discount_total,
      total: order.total,
      payment: order.payments[0],
    };

    res.json({
      message: 'Ticket enviado a impresora exitosamente',
      data: ticketData,
    });
  });
}



