import { PrismaClient, Coupon, CouponType } from '@prisma/client';

const prisma = new PrismaClient();

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  message: string;
}

export class CouponRepository {
  async findByCode(code: string): Promise<Coupon | null> {
    return prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  async validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
    const coupon = await this.findByCode(code);

    if (!coupon) {
      return {
        valid: false,
        discount: 0,
        message: 'Cupón no encontrado',
      };
    }

    if (!coupon.isActive) {
      return {
        valid: false,
        discount: 0,
        message: 'Cupón inactivo',
      };
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return {
        valid: false,
        discount: 0,
        message: 'Cupón expirado',
      };
    }

    if (coupon.minSubtotal && subtotal < coupon.minSubtotal.toNumber()) {
      return {
        valid: false,
        discount: 0,
        message: `Monto mínimo requerido: Q${coupon.minSubtotal.toFixed(2)}`,
      };
    }

    const discount = this.calculateDiscount(coupon, subtotal);

    return {
      valid: true,
      coupon,
      discount,
      message: 'Cupón aplicado exitosamente',
    };
  }

  private calculateDiscount(coupon: Coupon, subtotal: number): number {
    if (coupon.type === CouponType.PERCENTAGE) {
      return (subtotal * coupon.value.toNumber()) / 100;
    } else {
      // FIXED amount
      return Math.min(coupon.value.toNumber(), subtotal);
    }
  }

  async findActive(): Promise<Coupon[]> {
    return prisma.coupon.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    code: string;
    type: CouponType;
    value: number;
    minSubtotal?: number;
    expiresAt?: Date;
    isActive?: boolean;
  }): Promise<Coupon> {
    return prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });
  }

  async update(id: number, data: Partial<{
    code: string;
    type: CouponType;
    value: number;
    minSubtotal: number;
    expiresAt: Date;
    isActive: boolean;
  }>): Promise<Coupon> {
    const updateData = { ...data };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    return prisma.coupon.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.coupon.delete({
      where: { id },
    });
  }

  async findById(id: number): Promise<Coupon | null> {
    return prisma.coupon.findUnique({
      where: { id },
    });
  }
}
