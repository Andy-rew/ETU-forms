import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ValidationException } from '@app/exceptions/inherited-exceptions/common/validation.exception';

@Injectable()
export class AllowSchemaTemplateGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const user: UserEntity = request['user'];

    if (!user) {
      throw new ValidationException('No user in request');
    }

    return user.allowTemplates;
  }
}
