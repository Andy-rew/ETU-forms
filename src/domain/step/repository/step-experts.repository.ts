import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';

@Injectable()
export class StepExpertsRepository {
  constructor(@InjectRepository(StepExpertsEntity) private readonly repo: Repository<StepExpertsEntity>) {}

  public async saveMany(stepExperts: StepExpertsEntity[]): Promise<StepExpertsEntity[]> {
    return this.repo.manager.save(StepExpertsEntity, stepExperts);
  }

  public async findByStepIdAndProcessId(dto: {
    stepId?: number;
    processId: string;
    userId: number;
  }): Promise<StepExpertsEntity | null> {
    const query = this.repo
      .createQueryBuilder('stepExperts')
      .innerJoin('stepExperts.step', 'step')
      .where('step.process_id = :processId', { processId: dto.processId })
      .andWhere('stepExperts.user_id = :userId', { userId: dto.userId });

    if (dto.stepId) {
      query.andWhere('step.id = :stepId', { stepId: dto.stepId });
    }

    return query.getOne();
  }

  public async findByStepIdAndProcessIdOrFail(dto: { stepId?: number; processId: string; userId: number }) {
    const stepExpert = await this.findByStepIdAndProcessId(dto);
    if (!stepExpert) {
      throw new NotFoundException(`Step experts not found for stepId: ${dto.stepId} and processId: ${dto.processId}`);
    }
    return stepExpert;
  }

  public async save(stepExpert: StepExpertsEntity): Promise<StepExpertsEntity> {
    return this.repo.save(stepExpert);
  }

  public async findAllStepsForExpert(dto: { processId: string; userId: number }) {
    return this.repo
      .createQueryBuilder('stepExperts')
      .innerJoinAndSelect('stepExperts.step', 'step')
      .leftJoinAndSelect('step.parent', 'parent')
      .leftJoinAndSelect('step.formSchema', 'formSchema')
      .leftJoinAndSelect('step.formAcceptSchema', 'formAcceptSchema')
      .leftJoinAndSelect('step.formDeclineSchema', 'formDeclineSchema')
      .innerJoinAndSelect('step.process', 'process')
      .where('process.id = :processId', { processId: dto.processId })
      .andWhere('stepExperts.user_id = :userId', { userId: dto.userId })
      .getMany();
  }
}
