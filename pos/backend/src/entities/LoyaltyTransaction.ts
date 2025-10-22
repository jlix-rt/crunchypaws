import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LoyaltyAccount } from './LoyaltyAccount';
import { Order } from './Order';

@Entity('loyalty_transactions')
export class LoyaltyTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  account_id: number;

  @Column({ type: 'int' })
  points_delta: number;

  @Column({ type: 'varchar', length: 255 })
  reason: string;

  @Column({ type: 'int', nullable: true })
  @Index()
  order_id: number;

  @CreateDateColumn()
  @Index()
  created_at: Date;

  // Relaciones
  @ManyToOne(() => LoyaltyAccount, (account) => account.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: LoyaltyAccount;

  @ManyToOne(() => Order, (order) => order.id)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}



