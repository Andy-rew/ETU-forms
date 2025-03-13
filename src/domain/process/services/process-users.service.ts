import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '@domain/user/repository/user.repository';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { UserEntity } from '@domain/user/entities/user.entity';
import { StepEntity } from '@domain/step/entities/step.entity';
import { StepRepository } from '@domain/step/repositories/step.repository';
import { UserProcessManager } from '@domain/process/managers/user-process.manager';
import { CommonUserService } from '@domain/user/services/common-user.service';
import * as dayjs from 'dayjs';

@Injectable()
export class ProcessUsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly processRepository: ProcessRepository,
    private readonly stepRepository: StepRepository,
    private readonly userProcessManager: UserProcessManager,
    private readonly commonUserService: CommonUserService,
  ) {}

  private async addManagers(dto: { process: ProcessEntity; users: UserEntity[] }) {
    const processManagers = this.userProcessManager.createUserProcessManagers(dto);
    return this.processRepository.createProcessManagers(processManagers);
  }

  private async addExperts(dto: { users: UserEntity[]; step: StepEntity }) {
    const stepExperts = this.userProcessManager.createUserProcessStepExperts(dto);
    return this.processRepository.createProcessStepExperts(stepExperts);
  }

  private async addParticipants(dto: { process: ProcessEntity; users: UserEntity[] }) {
    const processParticipants = this.userProcessManager.createUserProcessParticipants(dto);
    return this.processRepository.createProcessParticipants(processParticipants);
  }

  async addUsersToProcess(dto: {
    processId: string;
    userType: ProcessUserRoleEnum;
    emails: string[];
    currentUser: UserEntity;
    stepId?: number;
  }) {
    const existUsers = await this.userRepository.findByEmails(dto.emails);
    const existDeletedUsers = existUsers.filter((user) => user.deletedAt !== null).map((user) => user.email);

    if (existDeletedUsers.length > 0) {
      throw new BadRequestException(
        `Users with emails ${existDeletedUsers.join(', ')} already deleted and should be invited by system admin`,
      );
    }

    const notExistEmails = dto.emails.filter((email) => !existUsers.find((user) => user.email === email));

    const invitedUsers = await this.commonUserService.inviteByEmails({
      emails: notExistEmails,
      sender: dto.currentUser,
    });

    existUsers.push(...invitedUsers);

    const process = await this.processRepository.findByIdOrFail(dto.processId);

    if (dayjs().isAfter(dayjs(process.endDate), 'date')) {
      throw new BadRequestException('Process is over');
    }

    switch (dto.userType) {
      case ProcessUserRoleEnum.expert:
        if (!dto.stepId) {
          throw new BadRequestException('stepId is required for inviting expert');
        }
        const stepWithProcess = await this.stepRepository.findOneWithProcessByIdOrFail(dto.stepId);

        if (process.id !== stepWithProcess.process.id) {
          throw new BadRequestException('Step does not belong to this process');
        }

        if (dayjs().isAfter(dayjs(stepWithProcess.endTime), 'minutes')) {
          throw new BadRequestException('Process step is over');
        }

        await this.addExperts({ users: existUsers, step: stepWithProcess });
        break;

      case ProcessUserRoleEnum.manager:
        await this.addManagers({ process, users: existUsers });
        break;

      case ProcessUserRoleEnum.participant:
        await this.addParticipants({ process, users: existUsers });
        break;

      default:
        throw new BadRequestException('Unknown user type');
    }
  }
}
