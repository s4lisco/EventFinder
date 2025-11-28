// backend/src/event/dto/create-event.dto.ts
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { EventStatus } from '../event.entity';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  priceInfo?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  locationName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  organizerName!: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  website?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
