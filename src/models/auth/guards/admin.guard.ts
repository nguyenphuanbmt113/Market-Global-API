import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const admin = req.user;
    for (let i = 0; i < admin.roles.length; i++) {
      if (admin.roles[i].role === 'admin') {
        return true;
      } else {
        return false;
      }
    }
  }
}
