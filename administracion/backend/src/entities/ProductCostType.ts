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
import { CostType } from './CostType';

@Entity('product_cost_types')
export class ProductCostType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  product_id: number;

  @Column({ type: 'int' })
  @Index()
  cost_type_id: number;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_selected: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Product, (product) => product.costTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => CostType, (costType) => costType.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cost_type_id' })
  costType: CostType;
}
