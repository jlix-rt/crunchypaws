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
import { User } from './User';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  @Index()
  user_id: number;

  @Column({ type: 'varchar', length: 100 })
  label: string;

  @Column({ type: 'boolean', default: false })
  @Index()
  is_default: boolean;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  department: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  municipality: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index()
  zone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  colonia: string;

  @Column({ type: 'varchar', length: 255 })
  street: string;

  @Column({ type: 'text', nullable: true })
  reference: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relaciones
  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}




