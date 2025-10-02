import { Request, Response } from 'express';
import { CouponRepository } from '@/repositories/CouponRepository';
import { ResponseHelper } from '@/utils/response';
import { CouponValidationData } from '@/utils/validation';

const couponRepository = new CouponRepository();

export class CouponController {
  async validateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { code, items }: CouponValidationData = req.body;

      // Calcular subtotal de los items
      const subtotal = items.reduce((sum, item) => {
        // Aquí deberíamos obtener el precio real del producto
        // Por simplicidad, asumimos que el precio viene en el item
        return sum + ((item as any).price || 0) * item.quantity;
      }, 0);

      const validation = await couponRepository.validateCoupon(code, subtotal);

      if (validation.valid) {
        ResponseHelper.success(res, {
          valid: true,
          discount: validation.discount,
          newTotal: subtotal - validation.discount,
          message: validation.message,
          coupon: {
            code: validation.coupon!.code,
            type: validation.coupon!.type,
            value: validation.coupon!.value.toNumber(),
          },
        });
      } else {
        ResponseHelper.success(res, {
          valid: false,
          discount: 0,
          newTotal: subtotal,
          message: validation.message,
        });
      }
    } catch (error) {
      console.error('Error validando cupón:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getActiveCoupons(req: Request, res: Response): Promise<void> {
    try {
      const coupons = await couponRepository.findActive();
      
      // Formatear respuesta sin exponer información sensible
      const formattedCoupons = coupons.map(coupon => ({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toNumber(),
        minSubtotal: coupon.minSubtotal?.toNumber(),
        expiresAt: coupon.expiresAt,
      }));

      ResponseHelper.success(res, formattedCoupons);
    } catch (error) {
      console.error('Error obteniendo cupones activos:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getCouponByCode(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;

      const coupon = await couponRepository.findByCode(code);
      if (!coupon) {
        ResponseHelper.notFound(res, 'Cupón no encontrado');
        return;
      }

      // Verificar si está activo y no expirado
      if (!coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) {
        ResponseHelper.error(res, 'Cupón no disponible');
        return;
      }

      ResponseHelper.success(res, {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toNumber(),
        minSubtotal: coupon.minSubtotal?.toNumber(),
        expiresAt: coupon.expiresAt,
      });
    } catch (error) {
      console.error('Error obteniendo cupón:', error);
      ResponseHelper.serverError(res);
    }
  }
}
