import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { ProductCostType } from './ProductCostType';

@Entity('cost_types')
export class CostType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  percentage: number;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_mandatory: boolean;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ProductCostType, (productCostType) => productCostType.costType)
  products: ProductCostType[];
}
