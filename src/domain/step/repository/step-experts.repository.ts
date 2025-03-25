import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';

@Injectable()
export class StepExpertsRepository {
  constructor(@InjectRepository(StepExpertsEntity) private readonly repo: Repository<StepExpertsEntity>) {}

  public async findByStepIdAndProcessId(dto: {
    stepId: number;
    processId: string;
    userId: number;
  }): Promise<StepExpertsEntity | null> {
    return this.repo
      .createQueryBuilder('stepExperts')
      .innerJoin('stepExperts.step', 'step')
      .where('step.id = :stepId', { stepId: dto.stepId })
      .andWhere('step.process_id = :processId', { processId: dto.processId })
      .andWhere('stepExperts.user_id = :userId', { userId: dto.userId })
      .getOne();
  }

  public async findByStepIdAndProcessIdOrFail(dto: { stepId: number; processId: string; userId: number }) {
    const stepExpert = await this.findByStepIdAndProcessId(dto);
    if (!stepExpert) {
      throw new NotFoundException(`Step experts not found for stepId: ${dto.stepId} and processId: ${dto.processId}`);
    }
    return stepExpert;
  }

  public async save(stepExpert: StepExpertsEntity): Promise<StepExpertsEntity> {
    return this.repo.save(stepExpert);
  }
}
