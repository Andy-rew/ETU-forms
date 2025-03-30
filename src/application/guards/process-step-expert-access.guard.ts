import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ValidationException } from '@app/exceptions/inherited-exceptions/common/validation.exception';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { StepExpertsRepository } from '@domain/step/repository/step-experts.repository';

@Injectable()
export class ProcessStepExpertAccessGuard implements CanActivate {
  constructor(@Inject(StepExpertsRepository) private readonly stepExpertsRepository: StepExpertsRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const processId = request.query['processId'] || request.body['processId'];
    const stepId = request.query['stepId'] || request.body['stepId'];

    if (!processId) {
      throw new ValidationException('Parameter "processId" is required in query or body');
    }

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
      await this.stepExpertsRepository.findByStepIdAndProcessIdOrFail({
        processId: String(processId),
        stepId: Number(stepId),
        userId: user.id,
      });
    } catch (err) {
      throw new ForbiddenException();
    }

    return true;
  }
}
