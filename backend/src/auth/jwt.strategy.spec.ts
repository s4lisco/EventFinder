// backend/src/auth/jwt.strategy.spec.ts
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate payload', async () => {
    const payload = {
      sub: 'organizer-id',
      email: 'test@example.com',
      role: 'organizer' as const,
    };

    const result = await strategy.validate(payload);
    expect(result).toEqual({
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  });
});
