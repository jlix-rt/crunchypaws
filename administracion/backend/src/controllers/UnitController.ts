import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Unit } from '../entities/Unit';

export class UnitController {
  // Obtener todas las unidades (no eliminadas)
  async getUnits(req: Request, res: Response): Promise<void> {
    try {
      const unitRepository = AppDataSource.getRepository(Unit);
      const units = await unitRepository.find({
        where: { is_deleted: false },
        order: { name: 'ASC' }
      });

      // Mapear a formato esperado por el frontend
      const formattedUnits = units.map(unit => ({
        id: unit.id,
        name: unit.name,
        symbol: unit.symbol,
        description: unit.description,
        category: unit.category,
        status: unit.is_active ? 'active' : 'inactive',
        createdAt: unit.created_at,
        updatedAt: unit.updated_at
      }));

      res.json({
        success: true,
        data: {
          units: formattedUnits,
          pagination: {
            page: 1,
            limit: 10,
            total: formattedUnits.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo unidades:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener unidades activas (para selects)
  async getActiveUnits(req: Request, res: Response): Promise<void> {
    try {
      const unitRepository = AppDataSource.getRepository(Unit);
      const units = await unitRepository.find({
        where: { is_active: true, is_deleted: false },
        order: { name: 'ASC' }
      });

      const formattedUnits = units.map(unit => ({
        id: unit.id,
        name: unit.name,
        symbol: unit.symbol,
        description: unit.description,
        category: unit.category
      }));

      res.json({
        success: true,
        data: { units: formattedUnits }
      });
    } catch (error) {
      console.error('Error obteniendo unidades activas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener unidad por ID
  async getUnitById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const unitRepository = AppDataSource.getRepository(Unit);
      
      const unit = await unitRepository.findOne({
        where: { id: parseInt(id), is_deleted: false }
      });

      if (!unit) {
        res.status(404).json({
          success: false,
          message: 'Unidad no encontrada'
        });
        return;
      }

      const formattedUnit = {
        id: unit.id,
        name: unit.name,
        symbol: unit.symbol,
        description: unit.description,
        category: unit.category,
        status: unit.is_active ? 'active' : 'inactive',
        createdAt: unit.created_at,
        updatedAt: unit.updated_at
      };

      res.json({
        success: true,
        data: { unit: formattedUnit }
      });
    } catch (error) {
      console.error('Error obteniendo unidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear unidad
  async createUnit(req: Request, res: Response): Promise<void> {
    try {
      const { name, symbol, description, category } = req.body;

      if (!name || !symbol) {
        res.status(400).json({
          success: false,
          message: 'El nombre y símbolo de la unidad son requeridos'
        });
        return;
      }

      const unitRepository = AppDataSource.getRepository(Unit);
      
      // Verificar si ya existe una unidad con el mismo nombre o símbolo
      const existingUnit = await unitRepository.findOne({
        where: [
          { name, is_deleted: false },
          { symbol, is_deleted: false }
        ]
      });

      if (existingUnit) {
        res.status(400).json({
          success: false,
          message: 'Ya existe una unidad con este nombre o símbolo'
        });
        return;
      }

      const newUnit = unitRepository.create({
        name,
        symbol,
        description: description || null,
        category: category || null,
        is_active: true,
        is_deleted: false
      });

      const savedUnit = await unitRepository.save(newUnit);

      const formattedUnit = {
        id: savedUnit.id,
        name: savedUnit.name,
        symbol: savedUnit.symbol,
        description: savedUnit.description,
        category: savedUnit.category,
        status: savedUnit.is_active ? 'active' : 'inactive',
        createdAt: savedUnit.created_at,
        updatedAt: savedUnit.updated_at
      };

      res.status(201).json({
        success: true,
        message: 'Unidad creada exitosamente',
        data: { unit: formattedUnit }
      });
    } catch (error) {
      console.error('Error creando unidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar unidad
  async updateUnit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, symbol, description, category, status } = req.body;

      const unitRepository = AppDataSource.getRepository(Unit);
      
      const existingUnit = await unitRepository.findOne({
        where: { id: parseInt(id), is_deleted: false }
      });

      if (!existingUnit) {
        res.status(404).json({
          success: false,
          message: 'Unidad no encontrada'
        });
        return;
      }

      // Verificar si el nuevo nombre o símbolo ya existe (si se están cambiando)
      if ((name && name !== existingUnit.name) || (symbol && symbol !== existingUnit.symbol)) {
        const duplicateUnit = await unitRepository.findOne({
          where: [
            { name: name || existingUnit.name, is_deleted: false },
            { symbol: symbol || existingUnit.symbol, is_deleted: false }
          ]
        });

        if (duplicateUnit && duplicateUnit.id !== existingUnit.id) {
          res.status(400).json({
            success: false,
            message: 'Ya existe una unidad con este nombre o símbolo'
          });
          return;
        }
      }

      // Actualizar campos
      if (name) existingUnit.name = name;
      if (symbol) existingUnit.symbol = symbol;
      if (description !== undefined) existingUnit.description = description;
      if (category !== undefined) existingUnit.category = category;
      if (status !== undefined) existingUnit.is_active = status === 'active';

      const updatedUnit = await unitRepository.save(existingUnit);

      const formattedUnit = {
        id: updatedUnit.id,
        name: updatedUnit.name,
        symbol: updatedUnit.symbol,
        description: updatedUnit.description,
        category: updatedUnit.category,
        status: updatedUnit.is_active ? 'active' : 'inactive',
        createdAt: updatedUnit.created_at,
        updatedAt: updatedUnit.updated_at
      };

      res.json({
        success: true,
        message: 'Unidad actualizada exitosamente',
        data: { unit: formattedUnit }
      });
    } catch (error) {
      console.error('Error actualizando unidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar unidad (eliminación lógica)
  async deleteUnit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const unitRepository = AppDataSource.getRepository(Unit);
      
      const existingUnit = await unitRepository.findOne({
        where: { id: parseInt(id), is_deleted: false }
      });

      if (!existingUnit) {
        res.status(404).json({
          success: false,
          message: 'Unidad no encontrada'
        });
        return;
      }

      // Verificar si la unidad está siendo usada en insumos
      const supplyRepository = AppDataSource.getRepository('Supply');
      const suppliesUsingUnit = await supplyRepository.count({
        where: { unit: existingUnit.symbol }
      });

      if (suppliesUsingUnit > 0) {
        res.status(400).json({
          success: false,
          message: 'No se puede eliminar la unidad porque está siendo usada en insumos'
        });
        return;
      }

      // Eliminación lógica
      existingUnit.is_deleted = true;
      await unitRepository.save(existingUnit);

      res.json({
        success: true,
        message: 'Unidad eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando unidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}
