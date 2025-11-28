// backend/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type JwtPayload = {
  sub: string;
  email: string;
  role: 'organizer' | 'admin';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change_me_in_prod',
    });
  }

  async validate(payload: JwtPayload) {
    // This attaches to req.user
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
