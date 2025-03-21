import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ValidationException } from '@app/exceptions/inherited-exceptions/common/validation.exception';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessManagerRepository } from '@domain/process/repository/process-manager.repository';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';

@Injectable()
export class ProcessMangerAccessGuard implements CanActivate {
  constructor(@Inject(ProcessManagerRepository) private readonly processManagerRepository: ProcessManagerRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const processId = request.query['processId'] || request.body['processId'];

    if (!processId) {
      throw new ValidationException('Parameter "processId" is required in query or body');
    }

    const user: UserEntity = request['user'];

    if (!user) {
      throw new ValidationException('No user in request');
    }

    if (user.roles.includes(UserRoleEnum.processAdmin)) {
      return true;
    }

    try {
      await this.processManagerRepository.findByProcessIdAndUserIdOrFail({
        processId: String(processId),
        userId: user.id,
      });
    } catch (err) {
      throw new ForbiddenException();
    }

    return true;
  }
}
