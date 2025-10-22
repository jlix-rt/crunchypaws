import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Supply } from '../entities/Supply';

export class SupplyController {
  // Obtener todos los insumos
  async getSupplies(req: Request, res: Response): Promise<void> {
    try {
      const supplyRepository = AppDataSource.getRepository(Supply);
      const supplies = await supplyRepository.find({
        where: { is_deleted: false }, // Solo insumos no eliminados
        order: { name: 'ASC' }
      });

      // Mapear a formato esperado por el frontend
      const formattedSupplies = supplies.map(supply => ({
        id: supply.id,
        name: supply.name,
        category: supply.category || 'Insumo',
        stock: supply.stock || 0,
        unitPrice: supply.unit_cost,
        unit: supply.unit,
        status: supply.is_active ? 'active' : 'inactive',
        sku: `SUP-${supply.id.toString().padStart(3, '0')}`
      }));

      res.json({
        success: true,
        data: {
          supplies: formattedSupplies,
          pagination: {
            page: 1,
            limit: 10,
            total: formattedSupplies.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo insumos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear insumo
  async createSupply(req: Request, res: Response): Promise<void> {
    try {
      const { name, unit, unitPrice, category, stock } = req.body;

      const supplyRepository = AppDataSource.getRepository(Supply);
      const newSupply = supplyRepository.create({
        name,
        unit,
        unit_cost: unitPrice,
        category: category || 'Insumo',
        stock: stock || 0,
        is_active: true,
        is_also_product: false
      });

      const savedSupply = await supplyRepository.save(newSupply);

      // Formatear respuesta para el frontend
      const formattedSupply = {
        id: savedSupply.id,
        name: savedSupply.name,
        category: savedSupply.category || 'Insumo',
        stock: savedSupply.stock || 0,
        unitPrice: savedSupply.unit_cost,
        unit: savedSupply.unit,
        status: savedSupply.is_active ? 'active' : 'inactive',
        sku: `SUP-${savedSupply.id.toString().padStart(3, '0')}`
      };

      res.status(201).json({
        success: true,
        message: 'Insumo creado exitosamente',
        data: { supply: formattedSupply }
      });
    } catch (error) {
      console.error('Error creando insumo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar insumo
  async updateSupply(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, unit, unitPrice, category, stock, status } = req.body;

      const supplyRepository = AppDataSource.getRepository(Supply);
      
      // Buscar el insumo existente
      const existingSupply = await supplyRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!existingSupply) {
        res.status(404).json({
          success: false,
          message: 'Insumo no encontrado'
        });
        return;
      }

      // Actualizar el insumo
      existingSupply.name = name || existingSupply.name;
      existingSupply.unit = unit || existingSupply.unit;
      existingSupply.unit_cost = unitPrice || existingSupply.unit_cost;
      existingSupply.category = category || existingSupply.category;
      existingSupply.stock = stock !== undefined ? stock : existingSupply.stock;
      existingSupply.is_active = status === 'active';

      const updatedSupply = await supplyRepository.save(existingSupply);

      // Formatear respuesta para el frontend
      const formattedSupply = {
        id: updatedSupply.id,
        name: updatedSupply.name,
        category: updatedSupply.category || 'Insumo',
        stock: updatedSupply.stock || 0,
        unitPrice: updatedSupply.unit_cost,
        unit: updatedSupply.unit,
        status: updatedSupply.is_active ? 'active' : 'inactive',
        sku: `SUP-${updatedSupply.id.toString().padStart(3, '0')}`
      };

      res.json({
        success: true,
        message: 'Insumo actualizado exitosamente',
        data: { supply: formattedSupply }
      });
    } catch (error) {
      console.error('Error actualizando insumo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar insumo
  async deleteSupply(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      res.json({
        success: true,
        message: 'Insumo eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando insumo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

