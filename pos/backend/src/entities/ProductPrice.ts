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
import { PriceList } from './PriceList';

@Entity('product_prices')
export class ProductPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  product_id: number;

  @Column({ type: 'int' })
  @Index()
  price_list_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => PriceList, (priceList) => priceList.productPrices)
  @JoinColumn({ name: 'price_list_id' })
  priceList: PriceList;
}



