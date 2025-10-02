import { Request, Response } from 'express';
import { UserRepository } from '@/repositories/UserRepository';
import { ResponseHelper } from '@/utils/response';
import { AuthenticatedRequest } from '@/types';
import { AddressData } from '@/utils/validation';

const userRepository = new UserRepository();

export class AddressController {
  async getAddresses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }

      const addresses = await userRepository.getAddresses(req.user.id);
      ResponseHelper.success(res, addresses);
    } catch (error) {
      console.error('Error obteniendo direcciones:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const addressId = parseInt(id);

      if (isNaN(addressId)) {
        ResponseHelper.error(res, 'ID de dirección inválido');
        return;
      }

      const address = await userRepository.getAddressById(addressId, req.user.id);
      if (!address) {
        ResponseHelper.notFound(res, 'Dirección no encontrada');
        return;
      }

      ResponseHelper.success(res, address);
    } catch (error) {
      console.error('Error obteniendo dirección:', error);
      ResponseHelper.serverError(res);
    }
  }

  async createAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }

      const addressData: AddressData = req.body;

      const address = await userRepository.createAddress(req.user.id, addressData);
      ResponseHelper.success(res, address, 'Dirección creada exitosamente', 201);
    } catch (error) {
      console.error('Error creando dirección:', error);
      ResponseHelper.serverError(res);
    }
  }

  async updateAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const addressId = parseInt(id);

      if (isNaN(addressId)) {
        ResponseHelper.error(res, 'ID de dirección inválido');
        return;
      }

      const addressData: Partial<AddressData> = req.body;

      // Verificar que la dirección existe y pertenece al usuario
      const existingAddress = await userRepository.getAddressById(addressId, req.user.id);
      if (!existingAddress) {
        ResponseHelper.notFound(res, 'Dirección no encontrada');
        return;
      }

      const updatedAddress = await userRepository.updateAddress(addressId, req.user.id, addressData);
      ResponseHelper.success(res, updatedAddress, 'Dirección actualizada exitosamente');
    } catch (error) {
      console.error('Error actualizando dirección:', error);
      ResponseHelper.serverError(res);
    }
  }

  async deleteAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const addressId = parseInt(id);

      if (isNaN(addressId)) {
        ResponseHelper.error(res, 'ID de dirección inválido');
        return;
      }

      // Verificar que la dirección existe y pertenece al usuario
      const existingAddress = await userRepository.getAddressById(addressId, req.user.id);
      if (!existingAddress) {
        ResponseHelper.notFound(res, 'Dirección no encontrada');
        return;
      }

      await userRepository.deleteAddress(addressId, req.user.id);
      ResponseHelper.success(res, null, 'Dirección eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando dirección:', error);
      ResponseHelper.serverError(res);
    }
  }

  async setDefaultAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }

      const { id } = req.params;
      const addressId = parseInt(id);

      if (isNaN(addressId)) {
        ResponseHelper.error(res, 'ID de dirección inválido');
        return;
      }

      const address = await userRepository.setDefaultAddress(addressId, req.user.id);
      ResponseHelper.success(res, address, 'Dirección predeterminada actualizada');
    } catch (error) {
      console.error('Error estableciendo dirección predeterminada:', error);
      
      if (error instanceof Error && error.message === 'Dirección no encontrada') {
        ResponseHelper.notFound(res, error.message);
        return;
      }
      
      ResponseHelper.serverError(res);
    }
  }
}
