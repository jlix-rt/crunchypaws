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

@Entity('product_recipe')
export class ProductRecipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  product_id: number;

  @Column({ type: 'int' })
  @Index()
  supply_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  total_cost_cached: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Supply, (supply) => supply.recipes)
  @JoinColumn({ name: 'supply_id' })
  supply: Supply;
}



