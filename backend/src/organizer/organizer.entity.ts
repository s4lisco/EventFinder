// backend/src/organizer/organizer.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from '../events/event.entity';

@Entity({ name: 'organizers' })
export class Organizer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Index('IDX_organizer_email', { unique: true })
  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column({ name: 'isActive', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => Event, (event) => event.organizer)
  events!: Event[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
