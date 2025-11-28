// backend/src/auth/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();

    // 👇 1) Skip if route has @Public()
    const isPublic = this.reflector.get<boolean>('isPublic', handler);

      console.log('👀 RolesGuard - isPublic?', isPublic); // ADD THIS

    if (isPublic) {
      return true;
    }

    // 👇 2) Get roles metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      handler,
      context.getClass(),
    ]);

    // No role requirements → allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 👇 3) Check authenticated user
    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: Role };

    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
