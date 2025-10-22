import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './Order';
import { OrderStatus } from './OrderStatus';

@Entity('order_status_history')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  order_id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  @Index()
  status: OrderStatus;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn()
  @Index()
  created_at: Date;

  // Relaciones
  @ManyToOne(() => Order, (order) => order.statusHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

