import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/role.decorator';
import { UserRole } from 'src/common/entities/role.entity';
import { User } from 'src/common/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    const user = context.switchToHttp().getRequest().user as User;
    console.log('user:', user);
    return requiredRoles.some((userRole) =>
      user.roles?.map((role) => role.role).includes(userRole),
    );
  }
}
