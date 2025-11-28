import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { EventStatus } from '../event-status.enum';
import { Organizer } from '../../organizer/organizer.entity';

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  @Index('idx_event_title_desc_text_search') // for text search
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'timestamp' })
  @Index('idx_event_start_date') // 🟢 correct
  start_date!: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date?: Date;

  @Column({ type: 'varchar', length: 50 })
  @Index('idx_event_category') // 🟢 correct
  category!: string;

  @Column({ type: 'float' })
  latitude!: number;

  @Column({ type: 'float' })
  longitude!: number;

  @Index('idx_event_location', { spatial: true })
  // Then for filtering by geolocation use query logic in service
  @Column({ type: 'float' })
  geoIndexPlaceholder!: number; // No real column needed for spatial; you probably use PostGIS geography column instead

  @ManyToOne(() => Organizer, (organizer) => organizer.events, { onDelete: 'CASCADE' })
  organizer!: Organizer;

  @Column({ type: 'text', nullable: true })
  website?: string;

  @Column({ type: 'text', array: true, nullable: true })
  images?: string[];

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  @Index('idx_event_status') // only approved events shown publicly
  status!: EventStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
