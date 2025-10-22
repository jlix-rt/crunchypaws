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
import { Product } from './Product';
import { Supply } from './Supply';

@Entity('product_supplies')
export class ProductSupply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  product_id: number;

  @Column({ type: 'int' })
  @Index()
  supply_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0.000 })
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Product, (product) => product.supplies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Supply, (supply) => supply.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supply_id' })
  supply: Supply;
}

