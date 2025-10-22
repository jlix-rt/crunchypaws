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
import { Branch } from './Branch';
import { ProductPrice } from './ProductPrice';

@Entity('price_lists')
export class PriceList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  @Index()
  branch_id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @ManyToOne(() => Branch, (branch) => branch.priceLists)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @OneToMany(() => ProductPrice, (productPrice) => productPrice.priceList)
  productPrices: ProductPrice[];
}



