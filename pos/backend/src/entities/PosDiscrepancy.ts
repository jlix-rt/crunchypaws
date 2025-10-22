import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PosSession } from './PosSession';

@Entity('pos_discrepancies')
export class PosDiscrepancy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  session_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text' })
  reason: string;

  @CreateDateColumn()
  created_at: Date;

  // Relaciones
  @ManyToOne(() => PosSession, (session) => session.discrepancies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: PosSession;
}



