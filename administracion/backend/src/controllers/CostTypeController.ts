import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { CostType } from '../entities/CostType';

export class CostTypeController {
  // Obtener todos los tipos de costos
  async getCostTypes(req: Request, res: Response): Promise<void> {
    try {
      const costTypeRepository = AppDataSource.getRepository(CostType);
      const costTypes = await costTypeRepository.find({
        order: { name: 'ASC' }
      });

      // Formatear para el frontend
      const formattedCostTypes = costTypes.map(costType => ({
        id: costType.id,
        name: costType.name,
        description: costType.description,
        percentage: parseFloat(costType.percentage.toString()),
        priority: costType.priority,
        isActive: costType.is_active,
        isMandatory: costType.is_mandatory,
        createdAt: costType.created_at,
        updatedAt: costType.updated_at
      }));

      res.json({
        success: true,
        data: {
          costTypes: formattedCostTypes,
          pagination: {
            page: 1,
            limit: 10,
            total: formattedCostTypes.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo tipos de costos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener tipo de costo por ID
  async getCostTypeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const costTypeRepository = AppDataSource.getRepository(CostType);
      
      const costType = await costTypeRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!costType) {
        res.status(404).json({
          success: false,
          message: 'Tipo de costo no encontrado'
        });
        return;
      }

      const formattedCostType = {
        id: costType.id,
        name: costType.name,
        description: costType.description,
        percentage: parseFloat(costType.percentage.toString()),
        priority: costType.priority,
        isActive: costType.is_active,
        isMandatory: costType.is_mandatory,
        createdAt: costType.created_at,
        updatedAt: costType.updated_at
      };

      res.json({
        success: true,
        data: { costType: formattedCostType }
      });
    } catch (error) {
      console.error('Error obteniendo tipo de costo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear tipo de costo
  async createCostType(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, percentage, isMandatory, priority } = req.body;

      const costTypeRepository = AppDataSource.getRepository(CostType);

      // Verificar que el nombre no exista
      const existingCostType = await costTypeRepository.findOne({
        where: { name }
      });

      if (existingCostType) {
        res.status(400).json({
          success: false,
          message: 'Ya existe un tipo de costo con ese nombre'
        });
        return;
      }

      // Verificar que la prioridad no exista
      const existingPriority = await costTypeRepository.findOne({
        where: { priority }
      });

      if (existingPriority) {
        res.status(400).json({
          success: false,
          message: 'Ya existe un tipo de costo con esa prioridad'
        });
        return;
      }

      const newCostType = costTypeRepository.create({
        name,
        description,
        percentage: percentage || 0,
        is_mandatory: isMandatory || false,
        priority: priority || 1
      });

      const savedCostType = await costTypeRepository.save(newCostType);

      const formattedCostType = {
        id: savedCostType.id,
        name: savedCostType.name,
        description: savedCostType.description,
        percentage: parseFloat(savedCostType.percentage.toString()),
        priority: savedCostType.priority,
        isActive: savedCostType.is_active,
        isMandatory: savedCostType.is_mandatory,
        createdAt: savedCostType.created_at,
        updatedAt: savedCostType.updated_at
      };

      res.status(201).json({
        success: true,
        message: 'Tipo de costo creado exitosamente',
        data: { costType: formattedCostType }
      });
    } catch (error) {
      console.error('Error creando tipo de costo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar tipo de costo
  async updateCostType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, percentage, isActive, isMandatory, priority } = req.body;

      const costTypeRepository = AppDataSource.getRepository(CostType);

      // Buscar el tipo de costo existente
      const existingCostType = await costTypeRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!existingCostType) {
        res.status(404).json({
          success: false,
          message: 'Tipo de costo no encontrado'
        });
        return;
      }

      // Verificar que el nombre no exista en otro registro
      if (name && name !== existingCostType.name) {
        const duplicateCostType = await costTypeRepository.findOne({
          where: { name }
        });

        if (duplicateCostType) {
          res.status(400).json({
            success: false,
            message: 'Ya existe un tipo de costo con ese nombre'
          });
          return;
        }
      }

      // Verificar que la prioridad no exista en otro registro
      if (priority && priority !== existingCostType.priority) {
        const duplicatePriority = await costTypeRepository.findOne({
          where: { priority }
        });

        if (duplicatePriority) {
          res.status(400).json({
            success: false,
            message: 'Ya existe un tipo de costo con esa prioridad'
          });
          return;
        }
      }

      // Actualizar el tipo de costo
      existingCostType.name = name || existingCostType.name;
      existingCostType.description = description !== undefined ? description : existingCostType.description;
      existingCostType.percentage = percentage !== undefined ? percentage : existingCostType.percentage;
      existingCostType.is_active = isActive !== undefined ? isActive : existingCostType.is_active;
      existingCostType.is_mandatory = isMandatory !== undefined ? isMandatory : existingCostType.is_mandatory;
      existingCostType.priority = priority !== undefined ? priority : existingCostType.priority;

      const updatedCostType = await costTypeRepository.save(existingCostType);

      const formattedCostType = {
        id: updatedCostType.id,
        name: updatedCostType.name,
        description: updatedCostType.description,
        percentage: parseFloat(updatedCostType.percentage.toString()),
        priority: updatedCostType.priority,
        isActive: updatedCostType.is_active,
        isMandatory: updatedCostType.is_mandatory,
        createdAt: updatedCostType.created_at,
        updatedAt: updatedCostType.updated_at
      };

      res.json({
        success: true,
        message: 'Tipo de costo actualizado exitosamente',
        data: { costType: formattedCostType }
      });
    } catch (error) {
      console.error('Error actualizando tipo de costo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar tipo de costo
  async deleteCostType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const costTypeRepository = AppDataSource.getRepository(CostType);

      const existingCostType = await costTypeRepository.findOne({
        where: { id: parseInt(id) }
      });

      if (!existingCostType) {
        res.status(404).json({
          success: false,
          message: 'Tipo de costo no encontrado'
        });
        return;
      }

      await costTypeRepository.remove(existingCostType);

      res.json({
        success: true,
        message: 'Tipo de costo eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando tipo de costo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener tipos de costos activos (para usar en productos)
  async getActiveCostTypes(req: Request, res: Response): Promise<void> {
    try {
      const costTypeRepository = AppDataSource.getRepository(CostType);
      const costTypes = await costTypeRepository.find({
        where: { is_active: true },
        order: { name: 'ASC' }
      });

      const formattedCostTypes = costTypes.map(costType => ({
        id: costType.id,
        name: costType.name,
        description: costType.description,
        percentage: parseFloat(costType.percentage.toString()),
        priority: costType.priority,
        isMandatory: costType.is_mandatory
      }));

      res.json({
        success: true,
        data: { costTypes: formattedCostTypes }
      });
    } catch (error) {
      console.error('Error obteniendo tipos de costos activos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}
