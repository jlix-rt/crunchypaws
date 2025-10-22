import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './Order';

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  order_id: number;

  @Column({ type: 'varchar', length: 100 })
  carrier: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Index()
  tracking_code: string;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  @Index()
  status: string;

  @Column({ type: 'json', nullable: true })
  events: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @ManyToOne(() => Order, (order) => order.shipments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

