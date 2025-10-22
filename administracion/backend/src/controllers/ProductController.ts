import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Product } from '../entities/Product';
import { Category } from '../entities/Category';
import { Supply } from '../entities/Supply';
import { ProductSupply } from '../entities/ProductSupply';
import { ProductCostType } from '../entities/ProductCostType';
import { ProductCategory } from '../entities/ProductCategory';

export class ProductController {
  // Obtener todos los productos
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const productRepository = AppDataSource.getRepository(Product);
      const products = await productRepository.find({
        relations: ['category', 'supplies', 'supplies.supply', 'categories', 'categories.category', 'costTypes', 'costTypes.costType'],
        order: { name: 'ASC' }
      });

      // Formatear productos para el frontend
      const formattedProducts = products.map(product => {
        // Formatear supplies
        const formattedSupplies = product.supplies?.map(ps => ({
          supplyId: ps.supply_id,
          quantity: parseFloat(ps.quantity.toString()),
          supplyName: ps.supply?.name || 'Insumo no encontrado'
        })) || [];

        // Formatear costos seleccionados
        const selectedCostTypes = product.costTypes?.map(pct => ({
          id: pct.cost_type_id,
          name: pct.costType?.name || 'Costo no encontrado',
          percentage: pct.costType?.percentage || 0,
          priority: pct.costType?.priority || 0,
          isMandatory: pct.costType?.is_mandatory || false,
          isSelected: pct.is_selected
        })) || [];

        // Formatear categorías
        const formattedCategories = product.categories?.map(pc => pc.category_id) || [];

        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category?.name || 'Sin categoría',
          price: parseFloat(product.final_price.toString()),
          basePrice: parseFloat(product.base_price.toString()),
          stock: product.stock,
          status: product.is_active ? 'active' : 'inactive',
          description: product.description,
          categories: formattedCategories,
          supplies: formattedSupplies,
          selectedCostTypes: selectedCostTypes,
          isAlsoSupply: product.is_also_supply,
          createdAt: product.created_at
        };
      });

      res.json({
        success: true,
        data: {
          products: formattedProducts,
          pagination: {
            page: 1,
            limit: 10,
            total: formattedProducts.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear producto
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { 
        name, 
        sku, 
        description, 
        categories, 
        stock, 
        status, 
        finalPrice,
        basePrice,
        suppliesData,
        isAlsoSupply,
        selectedCostTypes
      } = req.body;

      const productRepository = AppDataSource.getRepository(Product);
      const categoryRepository = AppDataSource.getRepository(Category);

      // Generar SKU si no se proporciona
      const productSku = sku || `PROD-${Date.now()}`;

      // Obtener la primera categoría (para compatibilidad con la estructura actual)
      const firstCategoryId = categories && categories.length > 0 ? categories[0] : 1;

      // Calcular costo base de insumos
      let baseCost = basePrice || 0;
      if (suppliesData && suppliesData.length > 0) {
        // Aquí se calcularía el costo real de los insumos
        // Por ahora usamos el basePrice proporcionado
        baseCost = basePrice || 0;
      }

      // Crear el producto
      const newProduct = productRepository.create({
        name,
        sku: productSku,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: description || '',
        category_id: firstCategoryId,
        is_active: status === 'active',
        stock: stock || 0,
        min_price: 0,
        max_price: 0,
        base_price: baseCost, // Costo base de insumos
        final_price: finalPrice || 0, // Precio final con impuestos
        is_also_supply: isAlsoSupply || false
      });

      const savedProduct = await productRepository.save(newProduct);

      // Si el producto es también un insumo, crear el registro en la tabla supplies
      if (isAlsoSupply) {
        const supplyRepository = AppDataSource.getRepository(Supply);
        
        // Calcular el costo real de los insumos del producto
        let totalSupplyCost = 0;
        if (suppliesData && suppliesData.length > 0) {
          for (const supplyData of suppliesData) {
            const supply = await supplyRepository.findOne({
              where: { id: supplyData.supplyId }
            });
            if (supply) {
              totalSupplyCost += parseFloat(supply.unit_cost.toString()) * supplyData.quantity;
            }
          }
        }
        
        console.log('💰 Costo total de insumos para nuevo producto:', totalSupplyCost);
        
        const newSupply = supplyRepository.create({
          name: name,
          unit: 'unidad', // Unidad por defecto, se puede mejorar
          unit_cost: totalSupplyCost, // Costo real de los insumos
          category: 'Producto',
          stock: stock || 0,
          is_active: status === 'active',
          is_also_product: true
        });
        
        await supplyRepository.save(newSupply);
        console.log('✅ Insumo creado para producto:', name, 'Costo:', totalSupplyCost);
      }

      // Manejar costos seleccionados (obligatorios y opcionales)
      if (selectedCostTypes && selectedCostTypes.length > 0) {
        const productCostTypeRepository = AppDataSource.getRepository(ProductCostType);
        
        console.log('💰 Guardando costos seleccionados:', selectedCostTypes);
        
        for (const costTypeId of selectedCostTypes) {
          const productCostType = productCostTypeRepository.create({
            product_id: savedProduct.id,
            cost_type_id: costTypeId,
            is_selected: true
          });
          await productCostTypeRepository.save(productCostType);
        }
        
        console.log('✅ Costos guardados para producto:', savedProduct.name);
      }

      // Formatear respuesta para el frontend
      const formattedProduct = {
        id: savedProduct.id,
        name: savedProduct.name,
        sku: savedProduct.sku,
        category: 'Categoría', // Se puede mejorar obteniendo el nombre real
        price: parseFloat(savedProduct.final_price.toString()),
        basePrice: parseFloat(savedProduct.base_price.toString()),
        stock: savedProduct.stock,
        status: savedProduct.is_active ? 'active' : 'inactive',
        description: savedProduct.description,
        categories: categories || [],
        supplies: suppliesData || [],
        selectedCostTypes: selectedCostTypes || [],
        isAlsoSupply: savedProduct.is_also_supply,
        createdAt: savedProduct.created_at
      };

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: { product: formattedProduct }
      });
    } catch (error) {
      console.error('Error creando producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar producto
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { 
        name, 
        sku, 
        description, 
        categories, 
        stock, 
        status, 
        finalPrice,
        basePrice,
        suppliesData,
        isAlsoSupply,
        selectedCostTypes
      } = req.body;

      console.log('Actualizando producto ID:', id);
      console.log('Datos recibidos:', req.body);
      console.log('Supplies data:', suppliesData);

      const productRepository = AppDataSource.getRepository(Product);
      
      // Buscar el producto existente
      const existingProduct = await productRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
        return;
      }

      // Guardar el estado anterior de is_also_supply para la lógica de eliminación
      const wasAlsoSupply = existingProduct.is_also_supply;

      // Obtener la primera categoría (para compatibilidad con la estructura actual)
      const firstCategoryId = categories && categories.length > 0 ? categories[0] : existingProduct.category_id;

      // Actualizar el producto
      existingProduct.name = name || existingProduct.name;
      existingProduct.sku = sku || existingProduct.sku;
      existingProduct.slug = name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : existingProduct.slug;
      existingProduct.description = description || existingProduct.description;
      existingProduct.category_id = firstCategoryId;
      existingProduct.is_active = status === 'active';
      existingProduct.stock = stock || existingProduct.stock;
      existingProduct.base_price = basePrice !== undefined ? basePrice : existingProduct.base_price;
      existingProduct.final_price = finalPrice || existingProduct.final_price;
      existingProduct.is_also_supply = isAlsoSupply !== undefined ? isAlsoSupply : existingProduct.is_also_supply;

      const updatedProduct = await productRepository.save(existingProduct);

      // Manejar si el producto es también un insumo
      console.log('🔍 Verificando isAlsoSupply:', isAlsoSupply);
      console.log('🔍 wasAlsoSupply (estado anterior):', wasAlsoSupply);
      console.log('🔍 Condición para eliminación lógica:', !isAlsoSupply && wasAlsoSupply);
      
      const supplyRepository = AppDataSource.getRepository(Supply);
      
      if (isAlsoSupply) {
        console.log('✅ isAlsoSupply es true, verificando insumo existente...');
        
        // Calcular el costo real de los insumos del producto
        let totalSupplyCost = 0;
        if (suppliesData && suppliesData.length > 0) {
          for (const supplyData of suppliesData) {
            const supply = await supplyRepository.findOne({
              where: { id: supplyData.supplyId }
            });
            if (supply) {
              totalSupplyCost += parseFloat(supply.unit_cost.toString()) * supplyData.quantity;
            }
          }
        }
        
        console.log('💰 Costo total de insumos calculado:', totalSupplyCost);
        
        // Verificar si ya existe un insumo para este producto (activo, inactivo o eliminado)
        const existingSupply = await supplyRepository.findOne({
          where: { 
            name: updatedProduct.name, 
            is_also_product: true 
          }
        });
        
        console.log('🔍 Insumo existente encontrado:', existingSupply ? 'SÍ' : 'NO');
        console.log('🔍 Estado del insumo:', existingSupply ? {
          is_active: existingSupply.is_active ? 'ACTIVO' : 'INACTIVO',
          is_deleted: existingSupply.is_deleted ? 'ELIMINADO' : 'NO ELIMINADO'
        } : 'NO EXISTE');
        
        if (!existingSupply) {
          console.log('📝 Creando nuevo insumo...');
          // Crear nuevo insumo
          const newSupply = supplyRepository.create({
            name: updatedProduct.name,
            unit: 'unidad',
            unit_cost: totalSupplyCost, // Costo real de los insumos
            category: 'Producto',
            stock: updatedProduct.stock,
            is_active: updatedProduct.is_active,
            is_also_product: true
          });
          
          const savedSupply = await supplyRepository.save(newSupply);
          console.log('✅ Insumo creado exitosamente:', savedSupply.id, savedSupply.name, 'Costo:', totalSupplyCost);
        } else {
          console.log('📝 Actualizando insumo existente...');
          // Actualizar insumo existente (reactivar si estaba inactivo o eliminado)
          existingSupply.unit_cost = totalSupplyCost; // Costo real de los insumos
          existingSupply.stock = updatedProduct.stock;
          existingSupply.is_active = true; // Reactivar siempre que se marque como insumo
          existingSupply.is_deleted = false; // Restaurar si estaba eliminado lógicamente
          await supplyRepository.save(existingSupply);
          console.log('✅ Insumo actualizado/reactivado/restaurado para producto:', updatedProduct.name, 'Nuevo costo:', totalSupplyCost);
        }
      } else if (!isAlsoSupply && wasAlsoSupply) {
        console.log('🗑️ Eliminando insumo lógicamente...');
        console.log('🔍 Buscando insumo para eliminar:', updatedProduct.name);
        
        // Eliminar lógicamente insumo si se desmarcó la opción
        const supplyToDelete = await supplyRepository.findOne({
          where: { 
            name: updatedProduct.name, 
            is_also_product: true,
            is_deleted: false // Solo buscar insumos no eliminados
          }
        });
        
        console.log('🔍 Insumo encontrado para eliminar:', supplyToDelete ? 'SÍ' : 'NO');
        
        if (supplyToDelete) {
          console.log('🔍 Estado actual del insumo:', {
            is_active: supplyToDelete.is_active,
            is_deleted: supplyToDelete.is_deleted
          });
          supplyToDelete.is_deleted = true; // Marcar como eliminado lógicamente
          const savedSupply = await supplyRepository.save(supplyToDelete);
          console.log('✅ Insumo eliminado lógicamente para producto:', updatedProduct.name);
          console.log('🔍 Estado después de eliminar:', {
            is_active: savedSupply.is_active,
            is_deleted: savedSupply.is_deleted
          });
        } else {
          console.log('⚠️ No se encontró el insumo para eliminar');
        }
      } else {
        console.log('ℹ️ No se requiere acción para insumo');
      }

      // Manejar categorías si se proporcionan
      if (categories && categories.length > 0) {
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
        
        // Eliminar categorías existentes
        await productCategoryRepository.delete({ product_id: parseInt(id) });
        
        // Agregar nuevas categorías
        for (let i = 0; i < categories.length; i++) {
          const productCategory = productCategoryRepository.create({
            product_id: parseInt(id),
            category_id: categories[i],
            is_primary: i === 0 // La primera categoría es la principal
          });
          await productCategoryRepository.save(productCategory);
        }
      }

      // Manejar supplies si se proporcionan
      if (suppliesData && suppliesData.length > 0) {
        const productSupplyRepository = AppDataSource.getRepository(ProductSupply);
        
        // Eliminar supplies existentes
        await productSupplyRepository.delete({ product_id: parseInt(id) });
        
        // Agregar nuevos supplies
        for (const supply of suppliesData) {
          const productSupply = productSupplyRepository.create({
            product_id: parseInt(id),
            supply_id: supply.supplyId,
            quantity: supply.quantity
          });
          await productSupplyRepository.save(productSupply);
        }
      }

      // Manejar costos seleccionados (obligatorios y opcionales)
      if (selectedCostTypes !== undefined) {
        const productCostTypeRepository = AppDataSource.getRepository(ProductCostType);
        
        console.log('💰 Actualizando costos seleccionados:', selectedCostTypes);
        
        // Eliminar costos existentes
        await productCostTypeRepository.delete({ product_id: parseInt(id) });
        
        // Agregar nuevos costos si se proporcionan
        if (selectedCostTypes && selectedCostTypes.length > 0) {
          for (const costTypeId of selectedCostTypes) {
            const productCostType = productCostTypeRepository.create({
              product_id: parseInt(id),
              cost_type_id: costTypeId,
              is_selected: true
            });
            await productCostTypeRepository.save(productCostType);
          }
        }
        
        console.log('✅ Costos actualizados para producto ID:', id);
      }

      // Obtener el producto actualizado con sus supplies y categorías
      const productWithRelations = await productRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['supplies', 'supplies.supply', 'categories', 'categories.category', 'costTypes', 'costTypes.costType']
      });

      // Formatear supplies para el frontend
      const formattedSupplies = productWithRelations?.supplies?.map(ps => ({
        supplyId: ps.supply_id,
        quantity: parseFloat(ps.quantity.toString()),
        supplyName: ps.supply?.name || 'Insumo no encontrado'
      })) || [];

      // Formatear costos seleccionados
      const formattedSelectedCostTypes = productWithRelations?.costTypes?.map(pct => ({
        id: pct.cost_type_id,
        name: pct.costType?.name || 'Costo no encontrado',
        percentage: pct.costType?.percentage || 0,
        priority: pct.costType?.priority || 0,
        isMandatory: pct.costType?.is_mandatory || false,
        isSelected: pct.is_selected
      })) || [];

      // Formatear categorías para el frontend
      const formattedCategories = productWithRelations?.categories?.map(pc => pc.category_id) || [];

      // Formatear respuesta para el frontend
      const formattedProduct = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        sku: updatedProduct.sku,
        category: 'Categoría', // Se puede mejorar obteniendo el nombre real
        price: parseFloat(updatedProduct.final_price.toString()),
        basePrice: parseFloat(updatedProduct.base_price.toString()),
        stock: updatedProduct.stock,
        status: updatedProduct.is_active ? 'active' : 'inactive',
        description: updatedProduct.description,
        categories: formattedCategories,
        supplies: formattedSupplies,
        selectedCostTypes: formattedSelectedCostTypes,
        isAlsoSupply: updatedProduct.is_also_supply,
        createdAt: updatedProduct.created_at,
        updatedAt: updatedProduct.updated_at
      };

      res.json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: { product: formattedProduct }
      });
    } catch (error) {
      console.error('Error actualizando producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar producto
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const productRepository = AppDataSource.getRepository(Product);
      
      // Buscar el producto existente
      const existingProduct = await productRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!existingProduct) {
        res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
        return;
      }

      // Eliminar el producto
      await productRepository.remove(existingProduct);

      res.json({
        success: true,
        message: 'Producto eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando producto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}



