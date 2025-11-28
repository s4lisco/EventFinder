// backend/src/event/event.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Point } from 'geojson'; // ✅ correct import
import { Organizer } from '../organizer/organizer.entity';

export enum EventStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity({ name: 'events' })
@Index('IDX_event_category', ['category'])
@Index('IDX_event_start_date', ['startDate'])
@Index('IDX_event_status', ['status'])
@Index('IDX_event_location_spatial', ['location'], { spatial: true })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'timestamptz' })
  startDate!: Date;

  @Column({ type: 'timestamptz', nullable: true })
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

  @Column({ type: 'double precision' })
  latitude!: number;

  @Column({ type: 'double precision' })
  longitude!: number;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location!: Point | null;

  @Column({ length: 255 })
  organizerName!: string;

  // 👇 EXPLICIT TEXT TYPE (no length)
  @Column({ type: 'text', nullable: true })
  website!: string | null;

  @Column({ type: 'text', array: true, nullable: true })
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

  @Column({ type: 'uuid', nullable: true })
  organizerId!: string | null;

  @ManyToOne(() => Organizer, (organizer) => organizer.events, {
    onDelete: 'SET NULL',
  })
  organizer!: Organizer;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
