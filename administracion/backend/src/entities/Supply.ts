import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ProductRecipe } from './ProductRecipe';
import { ProductSupply } from './ProductSupply';

@Entity('supplies')
export class Supply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  @Index()
  name: string;

  @Column({ type: 'varchar', length: 50 })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_cost: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  @Index()
  is_also_product: boolean;

  @Column({ type: 'boolean', default: false })
  @Index()
  is_deleted: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @OneToMany(() => ProductRecipe, (recipe) => recipe.supply)
  recipes: ProductRecipe[];

  @OneToMany(() => ProductSupply, (productSupply) => productSupply.supply)
  products: ProductSupply[];
}



