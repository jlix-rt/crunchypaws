import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';
import { LoyaltyTransaction } from './LoyaltyTransaction';

@Entity('loyalty_accounts')
export class LoyaltyAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  user_id: number;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'varchar', length: 50, default: 'BRONZE' })
  @Index()
  tier: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @OneToOne(() => User, (user) => user.loyaltyAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => LoyaltyTransaction, (transaction) => transaction.account)
  transactions: LoyaltyTransaction[];
}

