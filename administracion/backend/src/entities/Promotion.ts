import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  FREE_SHIPPING = 'FREE_SHIPPING',
}

export enum PromotionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED',
}

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PromotionType,
  })
  @Index()
  type: PromotionType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  min_order_amount: number;

  @Column({ type: 'timestamp' })
  @Index()
  starts_at: Date;

  @Column({ type: 'timestamp' })
  @Index()
  ends_at: Date;

  @Column({
    type: 'enum',
    enum: PromotionStatus,
    default: PromotionStatus.DRAFT,
  })
  @Index()
  status: PromotionStatus;

  @Column({ type: 'int', default: 0 })
  usage_count: number;

  @Column({ type: 'int', nullable: true })
  usage_limit: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}



