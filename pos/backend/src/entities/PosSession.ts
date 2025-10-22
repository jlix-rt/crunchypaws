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
import { Employee } from './Employee';
import { PosDiscrepancy } from './PosDiscrepancy';

@Entity('pos_sessions')
export class PosSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  employee_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  opened_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  closed_at: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  opening_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  closing_amount: number;

  // Relaciones
  @ManyToOne(() => Employee, (employee) => employee.sessions)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToMany(() => PosDiscrepancy, (discrepancy) => discrepancy.session)
  discrepancies: PosDiscrepancy[];
}



