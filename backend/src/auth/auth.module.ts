// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Organizer } from '../organizer/organizer.entity';
import { Admin } from '../admin/admin.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
    TypeOrmModule.forFeature([Organizer, Admin]),
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}
