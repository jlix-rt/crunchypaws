import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { PosSession } from './PosSession';

@Entity('employees')
export class Employee {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00 })
  commission_percent: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'id' })
  user: User;

  @OneToMany(() => PosSession, (session) => session.employee)
  sessions: PosSession[];
}



