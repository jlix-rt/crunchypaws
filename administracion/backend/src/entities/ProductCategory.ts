import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Product } from './Product';
import { Category } from './Category';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryColumn()
  product_id: number;

  @PrimaryColumn()
  category_id: number;

  @Column({ type: 'boolean', default: false })
  @Index()
  is_primary: boolean;

  @CreateDateColumn()
  created_at: Date;

  // Relaciones
  @ManyToOne(() => Product, (product) => product.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}


