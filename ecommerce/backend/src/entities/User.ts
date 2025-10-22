import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Address } from './Address';
import { Order } from './Order';
import { Review } from './Review';
import { LoyaltyAccount } from './LoyaltyAccount';

export enum UserRole {
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  full_name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Index()
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  nit: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  @Index()
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_active: boolean;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  @Index()
  referral_code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => LoyaltyAccount, (loyaltyAccount) => loyaltyAccount.user)
  loyaltyAccount: LoyaltyAccount;
}




