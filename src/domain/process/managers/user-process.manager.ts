import { Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { StepEntity } from '@domain/step/entities/step.entity';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { ProcessManagersEntity } from '@domain/process/entities/process-managers.entity';

@Injectable()
export class UserProcessManager {
  createUserProcessParticipants(dto: { users: UserEntity[]; process: ProcessEntity }): ProcessParticipantEntity[] {
    const processParticipants: ProcessParticipantEntity[] = [];

    dto.users.forEach((user) => {
      const participant = new ProcessParticipantEntity();
      participant.user = user;
      participant.process = dto.process;
      processParticipants.push(participant);
    });

    return processParticipants;
  }

  createUserProcessManagers(dto: { users: UserEntity[]; process: ProcessEntity }) {
    const processManagers: ProcessManagersEntity[] = [];

    dto.users.forEach((user) => {
      const manager = new ProcessManagersEntity();
      manager.user = user;
      manager.process = dto.process;
      processManagers.push(manager);
    });

    return processManagers;
  }

  createUserProcessStepExperts(dto: { users: UserEntity[]; step: StepEntity }): StepExpertsEntity[] {
    const stepExperts: StepExpertsEntity[] = [];

    dto.users.forEach((user) => {
      const stepExpert = new StepExpertsEntity();
      stepExpert.user = user;
      stepExpert.step = dto.step;
      stepExperts.push(stepExpert);
    });

    return stepExperts;
  }
}
