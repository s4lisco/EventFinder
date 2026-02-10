import { IsInt, Min, Max } from 'class-validator';

export class UploadEventImagesDto {
  @IsInt()
  @Min(0)
  @Max(2)
  position?: number;
}
