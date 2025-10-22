import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './Product';
import { PriceAddon } from './PriceAddon';

@Entity('product_addons')
export class ProductAddon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  product_id: number;

  @Column({ type: 'int' })
  @Index()
  addon_id: number;

  @CreateDateColumn()
  created_at: Date;

  // Relaciones
  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => PriceAddon, (addon) => addon.productAddons)
  @JoinColumn({ name: 'addon_id' })
  addon: PriceAddon;
}



