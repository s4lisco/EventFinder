// update-event-status.dto.ts
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { EventStatus } from '../../events/event-status.enum';

export class UpdateEventStatusDto {
  @IsEnum(EventStatus)
  status!: EventStatus;

  @IsOptional()
  @IsString()
  adminComment?: string;
}
