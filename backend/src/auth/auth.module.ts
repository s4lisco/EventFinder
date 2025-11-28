// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change_me_in_prod',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}
