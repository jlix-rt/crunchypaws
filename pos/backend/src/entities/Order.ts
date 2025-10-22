import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';
import { OrderItem } from './OrderItem';
import { Payment } from './Payment';
import { OrderStatusHistory } from './OrderStatusHistory';
import { Shipment } from './Shipment';

export enum OrderStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum OrderSource {
  ECOMMERCE = 'ECOMMERCE',
  POS = 'POS',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  @Index()
  user_id: number;

  @Column({ type: 'varchar', length: 20 })
  @Index()
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  nit: string;

  @Column({ type: 'json', nullable: true })
  address_snapshot: any;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  discount_total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  shipping_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  @Index()
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: OrderSource,
    default: OrderSource.POS,
  })
  @Index()
  source: OrderSource;

  @CreateDateColumn()
  @Index()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @OneToMany(() => OrderStatusHistory, (statusHistory) => statusHistory.order)
  statusHistory: OrderStatusHistory[];

  @OneToMany(() => Shipment, (shipment) => shipment.order)
  shipments: Shipment[];
}



