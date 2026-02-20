// backend/src/event/event.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Point } from 'geojson'; // ✅ correct import
import { Organizer } from '../organizer/organizer.entity';
import { EventImage } from './entities/event-image.entity';

export enum EventStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity({ name: 'events' })
@Index('IDX_event_category', ['category'])
@Index('IDX_event_start_date', ['startDate'])
@Index('IDX_event_status', ['status'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'datetime' })
  startDate!: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate!: Date | null;

  @Column({ length: 100 })
  category!: string;

  // 👇 EXPLICIT TEXT TYPE (no length)
  @Column({ type: 'text', nullable: true })
  priceInfo!: string | null;

  @Column({ length: 255 })
  locationName!: string;

  @Column({ length: 500 })
  address!: string;

  @Column({ type: 'double' })
  latitude!: number;

  @Column({ type: 'double' })
  longitude!: number;

  @Column({
    type: 'point',
    nullable: true,
  })
  location!: Point | null;

  @Column({ length: 255 })
  organizerName!: string;

  // 👇 EXPLICIT TEXT TYPE (no length)
  @Column({ type: 'text', nullable: true })
  website!: string | null;

  @Column({ type: 'json', nullable: true })
  images!: string[] | null;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  status!: EventStatus;

  // 👇 EXPLICIT TEXT TYPE (already OK, just ensuring consistency)
  @Column({ type: 'text', nullable: true })
  adminComment!: string | null;

  @Column({ type: 'varchar', length: 36, nullable: true })
  organizerId!: string | null;

  @ManyToOne(() => Organizer, (organizer) => organizer.events, {
    onDelete: 'SET NULL',
  })
  organizer!: Organizer;

  @OneToMany(() => EventImage, (eventImage) => eventImage.event)
  eventImages!: EventImage[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
