import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ProductCostBreakdown } from '../entities/ProductCostBreakdown';
import { Product } from '../entities/Product';
import { CostType } from '../entities/CostType';
import { ProductSupply } from '../entities/ProductSupply';
import { Supply } from '../entities/Supply';

export class CostBreakdownController {
  // Obtener todos los desgloses de costos
  async getCostBreakdowns(req: Request, res: Response): Promise<void> {
    try {
      const costBreakdownRepository = AppDataSource.getRepository(ProductCostBreakdown);
      const costBreakdowns = await costBreakdownRepository.find({
        relations: ['product'],
        order: { created_at: 'DESC' }
      });

      // Formatear para el frontend
      const formattedBreakdowns = costBreakdowns.map(breakdown => ({
        id: breakdown.id,
        productId: breakdown.product_id,
        productName: breakdown.product?.name || 'Producto no encontrado',
        baseCost: parseFloat(breakdown.base_cost.toString()),
        productionCost: parseFloat(breakdown.production_cost.toString()),
        marketingCost: parseFloat(breakdown.marketing_cost.toString()),
        profitMargin: parseFloat(breakdown.profit_margin.toString()),
        subtotal: parseFloat(breakdown.subtotal.toString()),
        ivaAmount: parseFloat(breakdown.iva_amount.toString()),
        isrAmount: parseFloat(breakdown.isr_amount.toString()),
        finalPrice: parseFloat(breakdown.final_price.toString()),
        ivaPercentage: parseFloat(breakdown.iva_percentage.toString()),
        isrPercentage: parseFloat(breakdown.isr_percentage.toString()),
        createdAt: breakdown.created_at,
        updatedAt: breakdown.updated_at
      }));

      res.json({
        success: true,
        data: {
          costBreakdowns: formattedBreakdowns,
          pagination: {
            page: 1,
            limit: 10,
            total: formattedBreakdowns.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo desgloses de costos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener desglose de costos por ID
  async getCostBreakdownById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const costBreakdownRepository = AppDataSource.getRepository(ProductCostBreakdown);
      
      const costBreakdown = await costBreakdownRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['product']
      });

      if (!costBreakdown) {
        res.status(404).json({
          success: false,
          message: 'Desglose de costos no encontrado'
        });
        return;
      }

      const formattedBreakdown = {
        id: costBreakdown.id,
        productId: costBreakdown.product_id,
        productName: costBreakdown.product?.name || 'Producto no encontrado',
        baseCost: parseFloat(costBreakdown.base_cost.toString()),
        productionCost: parseFloat(costBreakdown.production_cost.toString()),
        marketingCost: parseFloat(costBreakdown.marketing_cost.toString()),
        profitMargin: parseFloat(costBreakdown.profit_margin.toString()),
        subtotal: parseFloat(costBreakdown.subtotal.toString()),
        ivaAmount: parseFloat(costBreakdown.iva_amount.toString()),
        isrAmount: parseFloat(costBreakdown.isr_amount.toString()),
        finalPrice: parseFloat(costBreakdown.final_price.toString()),
        ivaPercentage: parseFloat(costBreakdown.iva_percentage.toString()),
        isrPercentage: parseFloat(costBreakdown.isr_percentage.toString()),
        createdAt: costBreakdown.created_at,
        updatedAt: costBreakdown.updated_at
      };

      res.json({
        success: true,
        data: { costBreakdown: formattedBreakdown }
      });
    } catch (error) {
      console.error('Error obteniendo desglose de costos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear desglose de costos
  async createCostBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const {
        productId,
        baseCost,
        productionCost,
        marketingCost,
        profitMargin,
        ivaPercentage,
        isrPercentage
      } = req.body;

      const costBreakdownRepository = AppDataSource.getRepository(ProductCostBreakdown);
      const productRepository = AppDataSource.getRepository(Product);

      // Verificar que el producto existe
      const product = await productRepository.findOne({
        where: { id: productId }
      });

      if (!product) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
        return;
      }

      // Calcular subtotal
      const subtotal = baseCost + productionCost + marketingCost + profitMargin;
      
      // Calcular impuestos
      const ivaAmount = subtotal * (ivaPercentage / 100);
      const isrAmount = subtotal * (isrPercentage / 100);
      
      // Calcular precio final
      const finalPrice = subtotal + ivaAmount + isrAmount;

      const newCostBreakdown = costBreakdownRepository.create({
        product_id: productId,
        base_cost: baseCost,
        production_cost: productionCost,
        marketing_cost: marketingCost,
        profit_margin: profitMargin,
        subtotal: subtotal,
        iva_amount: ivaAmount,
        isr_amount: isrAmount,
        final_price: finalPrice,
        iva_percentage: ivaPercentage,
        isr_percentage: isrPercentage
      });

      const savedCostBreakdown = await costBreakdownRepository.save(newCostBreakdown);

      // Actualizar el precio final del producto
      product.final_price = finalPrice;
      await productRepository.save(product);

      const formattedBreakdown = {
        id: savedCostBreakdown.id,
        productId: savedCostBreakdown.product_id,
        productName: product.name,
        baseCost: parseFloat(savedCostBreakdown.base_cost.toString()),
        productionCost: parseFloat(savedCostBreakdown.production_cost.toString()),
        marketingCost: parseFloat(savedCostBreakdown.marketing_cost.toString()),
        profitMargin: parseFloat(savedCostBreakdown.profit_margin.toString()),
        subtotal: parseFloat(savedCostBreakdown.subtotal.toString()),
        ivaAmount: parseFloat(savedCostBreakdown.iva_amount.toString()),
        isrAmount: parseFloat(savedCostBreakdown.isr_amount.toString()),
        finalPrice: parseFloat(savedCostBreakdown.final_price.toString()),
        ivaPercentage: parseFloat(savedCostBreakdown.iva_percentage.toString()),
        isrPercentage: parseFloat(savedCostBreakdown.isr_percentage.toString()),
        createdAt: savedCostBreakdown.created_at,
        updatedAt: savedCostBreakdown.updated_at
      };

      res.status(201).json({
        success: true,
        message: 'Desglose de costos creado exitosamente',
        data: { costBreakdown: formattedBreakdown }
      });
    } catch (error) {
      console.error('Error creando desglose de costos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar desglose de costos
  async updateCostBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        baseCost,
        productionCost,
        marketingCost,
        profitMargin,
        ivaPercentage,
        isrPercentage
      } = req.body;

      const costBreakdownRepository = AppDataSource.getRepository(ProductCostBreakdown);
      const productRepository = AppDataSource.getRepository(Product);

      // Buscar el desglose existente
      const existingBreakdown = await costBreakdownRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['product']
      });

      if (!existingBreakdown) {
        res.status(404).json({
          success: false,
          message: 'Desglose de costos no encontrado'
        });
        return;
      }

      // Calcular nuevos valores
      const subtotal = baseCost + productionCost + marketingCost + profitMargin;
      const ivaAmount = subtotal * (ivaPercentage / 100);
      const isrAmount = subtotal * (isrPercentage / 100);
      const finalPrice = subtotal + ivaAmount + isrAmount;

      // Actualizar el desglose
      existingBreakdown.base_cost = baseCost;
      existingBreakdown.production_cost = productionCost;
      existingBreakdown.marketing_cost = marketingCost;
      existingBreakdown.profit_margin = profitMargin;
      existingBreakdown.subtotal = subtotal;
      existingBreakdown.iva_amount = ivaAmount;
      existingBreakdown.isr_amount = isrAmount;
      existingBreakdown.final_price = finalPrice;
      existingBreakdown.iva_percentage = ivaPercentage;
      existingBreakdown.isr_percentage = isrPercentage;

      const updatedBreakdown = await costBreakdownRepository.save(existingBreakdown);

      // Actualizar el precio final del producto
      const product = await productRepository.findOne({
        where: { id: existingBreakdown.product_id }
      });

      if (product) {
        product.final_price = finalPrice;
        await productRepository.save(product);
      }

      const formattedBreakdown = {
        id: updatedBreakdown.id,
        productId: updatedBreakdown.product_id,
        productName: existingBreakdown.product?.name || 'Producto no encontrado',
        baseCost: parseFloat(updatedBreakdown.base_cost.toString()),
        productionCost: parseFloat(updatedBreakdown.production_cost.toString()),
        marketingCost: parseFloat(updatedBreakdown.marketing_cost.toString()),
        profitMargin: parseFloat(updatedBreakdown.profit_margin.toString()),
        subtotal: parseFloat(updatedBreakdown.subtotal.toString()),
        ivaAmount: parseFloat(updatedBreakdown.iva_amount.toString()),
        isrAmount: parseFloat(updatedBreakdown.isr_amount.toString()),
        finalPrice: parseFloat(updatedBreakdown.final_price.toString()),
        ivaPercentage: parseFloat(updatedBreakdown.iva_percentage.toString()),
        isrPercentage: parseFloat(updatedBreakdown.isr_percentage.toString()),
        createdAt: updatedBreakdown.created_at,
        updatedAt: updatedBreakdown.updated_at
      };

      res.json({
        success: true,
        message: 'Desglose de costos actualizado exitosamente',
        data: { costBreakdown: formattedBreakdown }
      });
    } catch (error) {
      console.error('Error actualizando desglose de costos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar desglose de costos
  async deleteCostBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const costBreakdownRepository = AppDataSource.getRepository(ProductCostBreakdown);

      const existingBreakdown = await costBreakdownRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!existingBreakdown) {
        res.status(404).json({
          success: false,
          message: 'Desglose de costos no encontrado'
        });
        return;
      }

      await costBreakdownRepository.remove(existingBreakdown);

      res.json({
        success: true,
        message: 'Desglose de costos eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando desglose de costos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener desgloses por producto
  async getCostBreakdownsByProduct(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const costBreakdownRepository = AppDataSource.getRepository(ProductCostBreakdown);
      
      const costBreakdowns = await costBreakdownRepository.find({
        where: { product_id: parseInt(productId) },
        relations: ['product'],
        order: { created_at: 'DESC' }
      });

      const formattedBreakdowns = costBreakdowns.map(breakdown => ({
        id: breakdown.id,
        productId: breakdown.product_id,
        productName: breakdown.product?.name || 'Producto no encontrado',
        baseCost: parseFloat(breakdown.base_cost.toString()),
        productionCost: parseFloat(breakdown.production_cost.toString()),
        marketingCost: parseFloat(breakdown.marketing_cost.toString()),
        profitMargin: parseFloat(breakdown.profit_margin.toString()),
        subtotal: parseFloat(breakdown.subtotal.toString()),
        ivaAmount: parseFloat(breakdown.iva_amount.toString()),
        isrAmount: parseFloat(breakdown.isr_amount.toString()),
        finalPrice: parseFloat(breakdown.final_price.toString()),
        ivaPercentage: parseFloat(breakdown.iva_percentage.toString()),
        isrPercentage: parseFloat(breakdown.isr_percentage.toString()),
        createdAt: breakdown.created_at,
        updatedAt: breakdown.updated_at
      }));

      res.json({
        success: true,
        data: { costBreakdowns: formattedBreakdowns }
      });
    } catch (error) {
      console.error('Error obteniendo desgloses por producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener desglose dinámico de todos los productos
  async getDynamicCostBreakdowns(req: Request, res: Response): Promise<void> {
    try {
      // Obtener todos los productos con sus insumos y costos seleccionados
      const productRepository = AppDataSource.getRepository(Product);
      const products = await productRepository.find({
        relations: ['supplies', 'supplies.supply', 'categories', 'categories.category', 'costTypes', 'costTypes.costType'],
        where: { is_active: true },
        order: { name: 'ASC' }
      });

      // Obtener todos los tipos de costos activos
      const costTypeRepository = AppDataSource.getRepository(CostType);
      const costTypes = await costTypeRepository.find({
        where: { is_active: true },
        order: { priority: 'ASC' }
      });

      // Calcular desglose dinámico para cada producto
      const dynamicBreakdowns = [];

      for (const product of products) {
        // Calcular costo base (suma de insumos)
        let baseCost = 0;
        if (product.supplies && product.supplies.length > 0) {
          baseCost = product.supplies.reduce((total, productSupply) => {
            const supplyCost = productSupply.supply?.unit_cost || 0;
            const quantity = productSupply.quantity || 0;
            return total + (supplyCost * quantity);
          }, 0);
        }

        // Si no hay insumos, usar el precio base del producto
        if (baseCost === 0) {
          baseCost = parseFloat(product.base_price?.toString() || '0');
        }

        // Calcular ganancia (30% por defecto, pero se puede personalizar)
        const profitPercentage = 30; // Esto se puede hacer configurable
        const profitAmount = baseCost * (profitPercentage / 100);
        let subtotal = baseCost + profitAmount;

        // Aplicar costos variables en orden de prioridad (solo los seleccionados para este producto)
        const costBreakdown: any = {
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          baseCost: baseCost,
          profitPercentage: profitPercentage,
          profitAmount: profitAmount,
          subtotal: subtotal,
          costs: [],
          finalPrice: subtotal
        };

        // Obtener solo los costos seleccionados para este producto
        const selectedCostTypes = product.costTypes?.filter(pct => pct.is_selected) || [];
        
        // Ordenar por prioridad
        const sortedSelectedCosts = selectedCostTypes
          .map(pct => pct.costType)
          .filter(ct => ct) // Filtrar costos nulos
          .sort((a, b) => a.priority - b.priority);

        // Aplicar cada tipo de costo seleccionado en orden de prioridad
        for (const costType of sortedSelectedCosts) {
          const costAmount = subtotal * (costType.percentage / 100);
          subtotal += costAmount;

          costBreakdown.costs.push({
            id: costType.id,
            name: costType.name,
            percentage: costType.percentage,
            amount: costAmount,
            priority: costType.priority,
            isMandatory: costType.is_mandatory,
            isSelected: true
          });
        }

        costBreakdown.finalPrice = subtotal;
        dynamicBreakdowns.push(costBreakdown);
      }

      res.json({
        success: true,
        data: {
          costBreakdowns: dynamicBreakdowns,
          costTypes: costTypes.map(ct => ({
            id: ct.id,
            name: ct.name,
            percentage: ct.percentage,
            priority: ct.priority,
            isMandatory: ct.is_mandatory
          })),
          pagination: {
            page: 1,
            limit: 10,
            total: dynamicBreakdowns.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo desglose dinámico:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}


