import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product';
import { PriceList } from '../entities/PriceList';
import { ProductPrice } from '../entities/ProductPrice';
import { CustomError, asyncHandler } from '../middleware/errorHandler';

export class ProductController {
  private productRepository = AppDataSource.getRepository(Product);
  private priceListRepository = AppDataSource.getRepository(PriceList);
  private productPriceRepository = AppDataSource.getRepository(ProductPrice);

  searchProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { sku, name, barcode } = req.query;

    let whereCondition: any = { is_active: true };

    if (sku) {
      whereCondition.sku = sku;
    } else if (name) {
      whereCondition.name = { $like: `%${name}%` };
    } else if (barcode) {
      // En una implementación real, aquí se buscaría por código de barras
      whereCondition.sku = barcode; // Por ahora usamos SKU como código de barras
    }

    const products = await this.productRepository.find({
      where: whereCondition,
      relations: ['category', 'images'],
      take: 10,
    });

    res.json({
      message: 'Productos encontrados exitosamente',
      data: products,
    });
  });

  getProductByBarcode = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.params;

    // En una implementación real, aquí se buscaría por código de barras
    // Por ahora usamos SKU como código de barras
    const product = await this.productRepository.findOne({
      where: { 
        sku: code,
        is_active: true 
      },
      relations: ['category', 'images', 'variants'],
    });

    if (!product) {
      throw new CustomError('Producto no encontrado', 404);
    }

    res.json({
      message: 'Producto obtenido exitosamente',
      data: product,
    });
  });

  getProductPrices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { price_list_id } = req.query;

    const queryBuilder = this.productPriceRepository
      .createQueryBuilder('pp')
      .leftJoinAndSelect('pp.priceList', 'pl')
      .where('pp.product_id = :productId', { productId: parseInt(id) });

    if (price_list_id) {
      queryBuilder.andWhere('pp.price_list_id = :priceListId', { priceListId: price_list_id });
    }

    const prices = await queryBuilder.getMany();

    res.json({
      message: 'Precios del producto obtenidos exitosamente',
      data: prices,
    });
  });

  getPriceLists = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const priceLists = await this.priceListRepository.find({
      where: { is_active: true },
      relations: ['branch'],
      order: { name: 'ASC' },
    });

    res.json({
      message: 'Listas de precios obtenidas exitosamente',
      data: priceLists,
    });
  });
}



