import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Location } from './location.entity';
import { User } from '../../users/entities/user.entity';

export enum EventStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamptz', nullable: true })
  date?: Date;

  @Column()
  category: string;

  @ManyToOne(() => Location, location => location.events, { nullable: true, cascade: true })
  @JoinColumn({ name: 'location_id' })
  location?: Location;

  @Column({ type: 'uuid', nullable: true })
  location_id?: string;

  @ManyToOne(() => User, user => user.events)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column({ type: 'uuid' })
  creator_id: string;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.PENDING })
  status: EventStatus;
}
