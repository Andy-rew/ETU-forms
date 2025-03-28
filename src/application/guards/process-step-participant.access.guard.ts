import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ValidationException } from '@app/exceptions/inherited-exceptions/common/validation.exception';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { StepParticipantsRepository } from '@domain/step/repository/step-participants.repository';
import { StepRepository } from '@domain/step/repository/step.repository';

@Injectable()
export class ProcessStepParticipantAccessGuard implements CanActivate {
  constructor(
    @Inject(StepParticipantsRepository) private readonly stepParticipantsRepository: StepParticipantsRepository,
    @Inject(StepRepository) private readonly stepRepository: StepRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const stepId = request.query['stepId'] || request.body['stepId'];

    if (!stepId) {
      throw new ValidationException('Parameter "stepId" is required in query or body');
    }

    const user: UserEntity = request['user'];

    if (!user) {
      throw new ValidationException('No user in request');
    }

    if (user.roles.includes(UserRoleEnum.processAdmin)) {
      return true;
    }

    try {
      const step = await this.stepRepository.findOneWithProcessById(stepId);
      if (step.process.linkAccess) {
        return true;
      }

      await this.stepParticipantsRepository.findAllByUserIdsOrFail({
        stepId: Number(stepId),
        processId: step.process.id,
        userIds: [user.id],
      });
    } catch (err) {
      throw new ForbiddenException();
    }

    return true;
  }
}
