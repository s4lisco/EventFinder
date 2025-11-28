// backend/src/event/dto/filter-events.dto.ts
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { EventStatus } from '../event.entity';

export class FilterEventsDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string; // text search in title & description

  // distance in kilometers from (lat, lon)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  distanceKm?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon?: number;

  // public listing should only show approved events
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
