import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { ROLES_KEY } from '@applications/decorators/auth-roles.decorator';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ValidationException } from '@app/exceptions/inherited-exceptions/common/validation.exception';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();

    const user: UserEntity = request['user'];

    if (!user) {
      throw new ValidationException('No user in request');
    }

    if (!requiredRoles.length) {
      return true;
    }

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
