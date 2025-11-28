// backend/src/organizer/dto/login-organizer.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginOrganizerDto {
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
