import { Request, Response } from 'express';
import { ProductRepository } from '@/repositories/ProductRepository';
import { CouponRepository } from '@/repositories/CouponRepository';
import { ResponseHelper } from '@/utils/response';
import { CartPriceData } from '@/utils/validation';
import { CartCalculation } from '@/types';

const productRepository = new ProductRepository();
const couponRepository = new CouponRepository();

export class CartController {
  async calculatePrice(req: Request, res: Response): Promise<void> {
    try {
      const { items, couponCode }: CartPriceData = req.body;

      // Obtener productos
      const productIds = items.map(item => item.productId);
      const products = await productRepository.findByIds(productIds);

      if (products.length !== items.length) {
        ResponseHelper.error(res, 'Algunos productos no fueron encontrados');
        return;
      }

      // Verificar stock
      const stockAvailable = await productRepository.checkStock(items);
      if (!stockAvailable) {
        ResponseHelper.error(res, 'Stock insuficiente para algunos productos', 409);
        return;
      }

      // Calcular subtotal
      const cartItems = items.map(item => {
        const product = products.find(p => p.id === item.productId)!;
        const subtotal = product.price.toNumber() * item.quantity;

        return {
          productId: item.productId,
          name: product.name,
          price: product.price.toNumber(),
          quantity: item.quantity,
          subtotal,
        };
      });

      const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      let discount = 0;
      let couponApplied: string | undefined;

      // Aplicar cupón si existe
      if (couponCode) {
        const couponValidation = await couponRepository.validateCoupon(couponCode, subtotal);
        
        if (couponValidation.valid) {
          discount = couponValidation.discount;
          couponApplied = couponCode;
        } else {
          ResponseHelper.error(res, couponValidation.message);
          return;
        }
      }

      const total = subtotal - discount;

      const calculation: CartCalculation = {
        items: cartItems,
        subtotal,
        discount,
        total,
        couponApplied,
      };

      ResponseHelper.success(res, calculation);
    } catch (error) {
      console.error('Error calculando precio del carrito:', error);
      ResponseHelper.serverError(res);
    }
  }

  async validateItems(req: Request, res: Response): Promise<void> {
    try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        ResponseHelper.error(res, 'Items del carrito son requeridos');
        return;
      }

      // Validar formato de items
      for (const item of items) {
        if (!item.productId || !item.quantity || item.quantity <= 0) {
          ResponseHelper.error(res, 'Formato de items inválido');
          return;
        }
      }

      // Verificar que los productos existen
      const productIds = items.map((item: any) => item.productId);
      const products = await productRepository.findByIds(productIds);

      const validationResults = items.map((item: any) => {
        const product = products.find(p => p.id === item.productId);
        
        if (!product) {
          return {
            productId: item.productId,
            valid: false,
            error: 'Producto no encontrado',
          };
        }

        if (product.stock < item.quantity) {
          return {
            productId: item.productId,
            valid: false,
            error: `Stock insuficiente. Disponible: ${product.stock}`,
            availableStock: product.stock,
          };
        }

        return {
          productId: item.productId,
          valid: true,
          product: {
            id: product.id,
            name: product.name,
            price: product.price.toNumber(),
            stock: product.stock,
            imageUrl: product.imageUrl,
          },
        };
      });

      const hasErrors = validationResults.some(result => !result.valid);

      ResponseHelper.success(res, {
        valid: !hasErrors,
        items: validationResults,
      });
    } catch (error) {
      console.error('Error validando items del carrito:', error);
      ResponseHelper.serverError(res);
    }
  }
}
