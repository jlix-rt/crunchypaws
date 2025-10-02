import { PrismaClient, User, UserAddress } from '@prisma/client';
import { RegisterData, UpdateProfileData, AddressData } from '@/utils/validation';

const prisma = new PrismaClient();

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: RegisterData & { passwordHash: string }): Promise<User> {
    const { password, ...userData } = data;
    return prisma.user.create({
      data: userData,
    });
  }

  async update(id: number, data: UpdateProfileData): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  // Address management
  async getAddresses(userId: number): Promise<UserAddress[]> {
    return prisma.userAddress.findMany({
      where: { userId },
      orderBy: [
        { esPredeterminada: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async getAddressById(id: number, userId: number): Promise<UserAddress | null> {
    return prisma.userAddress.findFirst({
      where: { id, userId },
    });
  }

  async createAddress(userId: number, data: AddressData): Promise<UserAddress> {
    return prisma.$transaction(async (tx) => {
      // Si es la primera dirección o se marca como predeterminada, desmarcar otras
      if (data.alias === 'default' || await this.isFirstAddress(userId)) {
        await tx.userAddress.updateMany({
          where: { userId },
          data: { esPredeterminada: false },
        });
      }

      return tx.userAddress.create({
        data: {
          ...data,
          userId,
          esPredeterminada: data.alias === 'default' || await this.isFirstAddress(userId),
        },
      });
    });
  }

  async updateAddress(id: number, userId: number, data: Partial<AddressData>): Promise<UserAddress> {
    return prisma.userAddress.update({
      where: { id },
      data: {
        ...data,
        // Verificar que la dirección pertenece al usuario
        userId,
      },
    });
  }

  async deleteAddress(id: number, userId: number): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const address = await tx.userAddress.findFirst({
        where: { id, userId },
      });

      if (!address) {
        throw new Error('Dirección no encontrada');
      }

      await tx.userAddress.delete({
        where: { id },
      });

      // Si era la predeterminada, marcar otra como predeterminada
      if (address.esPredeterminada) {
        const firstAddress = await tx.userAddress.findFirst({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });

        if (firstAddress) {
          await tx.userAddress.update({
            where: { id: firstAddress.id },
            data: { esPredeterminada: true },
          });
        }
      }
    });
  }

  async setDefaultAddress(id: number, userId: number): Promise<UserAddress> {
    return prisma.$transaction(async (tx) => {
      // Verificar que la dirección existe y pertenece al usuario
      const address = await tx.userAddress.findFirst({
        where: { id, userId },
      });

      if (!address) {
        throw new Error('Dirección no encontrada');
      }

      // Desmarcar todas las direcciones como predeterminadas
      await tx.userAddress.updateMany({
        where: { userId },
        data: { esPredeterminada: false },
      });

      // Marcar la dirección seleccionada como predeterminada
      return tx.userAddress.update({
        where: { id },
        data: { esPredeterminada: true },
      });
    });
  }

  private async isFirstAddress(userId: number): Promise<boolean> {
    const count = await prisma.userAddress.count({
      where: { userId },
    });
    return count === 0;
  }
}
