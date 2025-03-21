import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ValidationException } from '@app/exceptions/inherited-exceptions/common/validation.exception';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { ProcessParticipantRepository } from '@domain/process/repository/process-participant.repository';

@Injectable()
export class ProcessParticipantAccessGuard implements CanActivate {
  constructor(
    @Inject(ProcessParticipantRepository) private readonly processParticipantRepository: ProcessParticipantRepository,
  ) {}

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
      await this.processParticipantRepository.findByProcessIdAndUserIdOrFail({
        processId: String(processId),
        userId: user.id,
      });
    } catch (err) {
      throw new ForbiddenException();
    }

    return true;
  }
}
