// backend/src/admin/dto/login-admin.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginAdminDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
