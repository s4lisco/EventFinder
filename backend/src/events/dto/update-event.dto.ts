// backend/src/event/dto/update-event.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from '../event.entity';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
