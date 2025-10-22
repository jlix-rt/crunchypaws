import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Product } from './Product';

@Entity('product_cost_breakdown')
export class ProductCostBreakdown {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  product_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  base_cost: number; // Costo base de insumos

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  production_cost: number; // Costo de producción (mano de obra, equipos)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  marketing_cost: number; // Costo de marketing

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  profit_margin: number; // Margen de ganancia

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  subtotal: number; // Subtotal antes de impuestos

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  iva_amount: number; // IVA (12%)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  isr_amount: number; // ISR (5%)

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  final_price: number; // Precio final

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 12.00 })
  iva_percentage: number; // Porcentaje de IVA

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.00 })
  isr_percentage: number; // Porcentaje de ISR

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @ManyToOne(() => Product, (product) => product.costBreakdowns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

