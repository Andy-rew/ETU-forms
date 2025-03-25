import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StepParticipantsRepository {
  constructor(@InjectRepository(StepParticipantsEntity) private readonly repo: Repository<StepParticipantsEntity>) {}

  async saveMany(stepParticipants: StepParticipantsEntity[]): Promise<StepParticipantsEntity[]> {
    return this.repo.save(stepParticipants);
  }

  async findAndCountStepParticipantsByStepId(dto: {
    stepId: number;
    processId: string;
    limit: number;
    offset: number;
    nameFilter?: string;
    surnameFilter?: string;
    patronymicFilter?: string;
    emailFilter?: string;
  }): Promise<[StepParticipantsEntity[], number]> {
    const query = this.repo
      .createQueryBuilder('step_participants')
      .innerJoinAndSelect('step_participants.processParticipant', 'processParticipant')
      .innerJoinAndSelect('processParticipant.user', 'user')
      .innerJoinAndSelect('step_participants.step', 'step')
      .leftJoinAndSelect('step_participants.filledForm', 'filledForm')
      .leftJoinAndSelect('step_participants.mainReaction', 'mainReaction')
      .where('step.id = :stepId', { stepId: dto.stepId })
      .andWhere('step.process_id = :processId', { processId: dto.processId })
      .limit(dto.limit)
      .offset(dto.offset);

    if (dto.nameFilter) {
      query.andWhere('user.name ILIKE :nameFilter', { nameFilter: `%${dto.nameFilter}%` });
    }

    if (dto.surnameFilter) {
      query.andWhere('user.surname ILIKE :surnameFilter', { surnameFilter: `%${dto.surnameFilter}%` });
    }

    if (dto.patronymicFilter) {
      query.andWhere('user.patronymic ILIKE :patronymicFilter', { patronymicFilter: `%${dto.patronymicFilter}%` });
    }

    if (dto.emailFilter) {
      query.andWhere('user.email ILIKE :emailFilter', { emailFilter: `%${dto.emailFilter}%` });
    }

    return query.getManyAndCount();
  }
}
