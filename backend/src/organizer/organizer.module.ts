// backend/src/organizer/organizer.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from './organizer.entity';
import { OrganizerService } from './organizer.service';
import { OrganizerController } from './organizer.controller';
import { Event } from '../events/event.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organizer, Event]), AuthModule],
  providers: [OrganizerService],
  controllers: [OrganizerController],
  exports: [OrganizerService],
})
export class OrganizerModule {}
