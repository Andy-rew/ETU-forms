import { Injectable } from '@nestjs/common';
import { StepExpertsRepository } from '@domain/step/repository/step-experts.repository';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';

@Injectable()
export class StepExpertsService {
  constructor(private readonly stepExpertsRepository: StepExpertsRepository) {}

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
}
