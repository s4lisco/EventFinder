// backend/src/event/dto/create-event.dto.ts
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { EventStatus } from '../event.entity';
import { EVENT_CATEGORIES } from '../event-category.constants';
import { IsAfter } from '../validators/is-after.validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description!: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  @IsAfter('startDate', { message: 'endDate must be after startDate' })
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(EVENT_CATEGORIES, {
    message: `category must be one of: ${EVENT_CATEGORIES.join(', ')}`,
  })
  category!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  priceInfo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  locationName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
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
