import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Payment } from './Payment';

export enum PaymentMethodType {
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  CASH = 'CASH',
  WALLET = 'WALLET',
  OTHERS = 'OTHERS',
}

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodType,
  })
  @Index()
  type: PaymentMethodType;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @OneToMany(() => Payment, (payment) => payment.method)
  payments: Payment[];
}



