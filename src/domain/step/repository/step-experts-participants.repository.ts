import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StepExpertsParticipantsEntity } from '@domain/step/entities/step-experts-participants.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StepExpertsParticipantsRepository {
  constructor(
    @InjectRepository(StepExpertsParticipantsEntity) private readonly repo: Repository<StepExpertsParticipantsEntity>,
  ) {}

  async saveMany(stepExpertsParticipants: StepExpertsParticipantsEntity[]): Promise<StepExpertsParticipantsEntity[]> {
    return this.repo.save(stepExpertsParticipants);
  }

  async getParticipantsForExpert(dto: {
    stepId: number;
    limit: number;
    offset: number;
    processId: string;
    userExpertId: number;
  }): Promise<[StepExpertsParticipantsEntity[], number]> {
    return this.repo
      .createQueryBuilder('stepExpertsParticipants')
      .innerJoinAndSelect('stepExpertsParticipants.stepExpert', 'stepExpert')
      .innerJoinAndSelect('stepExpertsParticipants.stepParticipant', 'stepParticipant')
      .innerJoinAndSelect('stepParticipant.processParticipant', 'processParticipant')
      .innerJoinAndSelect('processParticipant.user', 'user')
      .innerJoinAndSelect('stepExpert.step', 'step')
      .leftJoinAndSelect('stepParticipant.filledForm', 'filledForm')
      .where('step.id = :stepId', { stepId: dto.stepId })
      .andWhere('step.process_id = :processId', { processId: dto.processId })
      .andWhere('stepExpert.user_id = :userId', { userId: dto.userExpertId })
      .limit(dto.limit)
      .offset(dto.offset)
      .getManyAndCount();
  }
}
