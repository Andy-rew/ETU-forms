import { Injectable } from '@nestjs/common';
import { StepExpertsRepository } from '@domain/step/repository/step-experts.repository';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';
import { StepParticipantsRepository } from '@domain/step/repository/step-participants.repository';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { StepManager } from '@domain/step/managers/step.manager';
import { StepExpertsParticipantsRepository } from '@domain/step/repository/step-experts-participants.repository';
import { StepExpertsParticipantsEntity } from '@domain/step/entities/step-experts-participants.entity';

@Injectable()
export class StepExpertsService {
  constructor(
    private readonly stepExpertsRepository: StepExpertsRepository,
    private readonly stepParticipantsRepository: StepParticipantsRepository,
    private readonly stepExpertsParticipantsRepository: StepExpertsParticipantsRepository,
    private readonly stepManager: StepManager,
  ) {}

  async settMainStepExpert(dto: {
    stepId: number;
    processId: string;
    userId: number;
    isMain: boolean;
  }): Promise<StepExpertsEntity> {
    const stepExpert = await this.stepExpertsRepository.findByStepIdAndProcessIdOrFail({
      stepId: dto.stepId,
      userId: dto.userId,
      processId: dto.processId,
    });

    stepExpert.isMain = dto.isMain;

    return this.stepExpertsRepository.save(stepExpert);
  }

  async setParticipantsForExpert(dto: {
    stepId: number;
    processId: string;
    userExpertId: number;
    allParticipants: boolean;
    userParticipantsIds?: number[] | null;
  }): Promise<StepExpertsParticipantsEntity[]> {
    const stepExpert: StepExpertsEntity = await this.stepExpertsRepository.findByStepIdAndProcessIdOrFail({
      stepId: dto.stepId,
      userId: dto.userExpertId,
      processId: dto.processId,
    });

    const stepParticipants: StepParticipantsEntity[] = await this.stepParticipantsRepository.findAllByUserIdsOrFail({
      stepId: dto.stepId,
      processId: dto.processId,
      userIds: dto.allParticipants ? null : dto.userParticipantsIds,
    });

    const expertParticipants = this.stepManager.createStepExpertParticipantsEntity({
      stepExpert,
      stepParticipants,
    });

    return this.stepExpertsParticipantsRepository.saveMany(expertParticipants);
  }
}
