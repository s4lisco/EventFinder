// backend/src/event/event.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventImage } from './entities/event-image.entity';
import { Organizer } from '../organizer/organizer.entity';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { LocalDiskStorage } from './storage/local-disk.storage';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventImage, Organizer])],
  providers: [
    EventService,
    {
      provide: 'StorageService',
      useClass: LocalDiskStorage,
    },
  ],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
