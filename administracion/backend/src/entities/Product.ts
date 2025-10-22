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
import { Category } from './Category';
import { ProductImage } from './ProductImage';
import { ProductVariant } from './ProductVariant';
import { OrderItem } from './OrderItem';
import { Review } from './Review';
import { ProductRecipe } from './ProductRecipe';
import { ProductAddon } from './ProductAddon';
import { ProductCategory } from './ProductCategory';
import { ProductCostBreakdown } from './ProductCostBreakdown';
import { ProductSupply } from './ProductSupply';
import { ProductCostType } from './ProductCostType';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  @Index()
  category_id: number;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_active: boolean;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  min_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  max_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  base_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  @Index()
  final_price: number;

  @Column({ type: 'boolean', default: false })
  @Index()
  is_also_supply: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => ProductRecipe, (recipe) => recipe.product)
  recipes: ProductRecipe[];

  @OneToMany(() => ProductAddon, (addon) => addon.product)
  addons: ProductAddon[];

  @OneToMany(() => ProductCategory, (productCategory) => productCategory.product)
  categories: ProductCategory[];

  @OneToMany(() => ProductCostBreakdown, (costBreakdown) => costBreakdown.product)
  costBreakdowns: ProductCostBreakdown[];

  @OneToMany(() => ProductSupply, (productSupply) => productSupply.product)
  supplies: ProductSupply[];

  @OneToMany(() => ProductCostType, (productCostType) => productCostType.product)
  costTypes: ProductCostType[];
}

