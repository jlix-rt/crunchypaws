import { PrismaClient, Order, OrderItem, OrderStatus } from '@prisma/client';
import { OrderCreateData } from '@/types';

const prisma = new PrismaClient();

export interface OrderWithItems extends Order {
  items: Array<OrderItem & {
    product: {
      id: number;
      name: string;
      imageUrl: string | null;
    };
  }>;
}

export interface OrderWithDetails extends Order {
  items: Array<OrderItem & {
    product: {
      id: number;
      name: string;
      imageUrl: string | null;
    };
  }>;
  user?: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
  };
}

export class OrderRepository {
  async create(orderData: OrderCreateData, calculatedTotals: {
    subtotal: number;
    discount: number;
    total: number;
  }): Promise<OrderWithItems> {
    return prisma.$transaction(async (tx) => {
      // Crear la orden
      const order = await tx.order.create({
        data: {
          userId: orderData.userId,
          addressId: orderData.addressId,
          customerName: orderData.customer?.name || '',
          email: orderData.customer?.email || '',
          phone: orderData.customer?.phone || '',
          billingNit: orderData.customer?.billingNit,
          shipToLine1: orderData.customer?.address.line1 || '',
          shipToLine2: orderData.customer?.address.line2,
          shipToMunicipio: orderData.customer?.address.municipio || '',
          shipToDepartamento: orderData.customer?.address.departamento || '',
          shipToCodigoPostal: orderData.customer?.address.codigoPostal,
          shipToReferencia: orderData.customer?.address.referencia,
          paymentMethod: orderData.paymentMethod,
          status: OrderStatus.PENDING,
          subtotal: calculatedTotals.subtotal,
          discount: calculatedTotals.discount,
          total: calculatedTotals.total,
        },
      });

      // Si hay addressId, copiar datos de la dirección
      if (orderData.addressId) {
        const address = await tx.userAddress.findUnique({
          where: { id: orderData.addressId },
          include: { user: true },
        });

        if (address) {
          await tx.order.update({
            where: { id: order.id },
            data: {
              customerName: `${address.user.nombre} ${address.user.apellido}`,
              email: address.user.email,
              phone: address.user.telefono,
              billingNit: address.user.nit,
              shipToLine1: address.line1,
              shipToLine2: address.line2,
              shipToMunicipio: address.municipio,
              shipToDepartamento: address.departamento,
              shipToCodigoPostal: address.codigoPostal,
              shipToReferencia: address.referencia,
            },
          });
        }
      }

      // Crear items de la orden
      const orderItems = [];
      for (const item of orderData.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Producto con ID ${item.productId} no encontrado`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Stock insuficiente para ${product.name}`);
        }

        // Crear item de orden
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            nameSnapshot: product.name,
            priceSnapshot: product.price,
            quantity: item.quantity,
          },
        });

        // Actualizar stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        orderItems.push(orderItem);
      }

      // Retornar orden completa con items
      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      }) as Promise<OrderWithItems>;
    });
  }

  async findById(id: number): Promise<OrderWithDetails | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number, limit = 10, offset = 0): Promise<OrderWithItems[]> {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async getOrderStats(userId?: number): Promise<{
    total: number;
    pending: number;
    paid: number;
    cancelled: number;
  }> {
    const where = userId ? { userId } : {};

    const [total, pending, paid, cancelled] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.count({ where: { ...where, status: OrderStatus.PENDING } }),
      prisma.order.count({ where: { ...where, status: OrderStatus.PAID } }),
      prisma.order.count({ where: { ...where, status: OrderStatus.CANCELLED } }),
    ]);

    return { total, pending, paid, cancelled };
  }

  async getRecentOrders(limit = 10): Promise<OrderWithDetails[]> {
    return prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
