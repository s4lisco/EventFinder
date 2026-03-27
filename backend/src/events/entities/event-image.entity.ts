import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../event.entity';

@Entity({ name: 'event_images' })
export class EventImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36 })
  eventId!: string;

  @ManyToOne(() => Event, (event) => event.eventImages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event!: Event;

  @Column({ type: 'varchar', length: 500 })
  storageKey!: string;

  @Column({ type: 'varchar', length: 500 })
  url!: string;

  @Column({ type: 'int', default: 0 })
  position!: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
