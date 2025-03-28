import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { Repository } from 'typeorm';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';

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

  async findAllByUserIds(dto: {
    stepId: number;
    processId: string;
    userIds?: number[] | null;
  }): Promise<StepParticipantsEntity[]> {
    const query = this.repo
      .createQueryBuilder('step_participants')
      .innerJoinAndSelect('step_participants.processParticipant', 'processParticipant')
      .innerJoinAndSelect('processParticipant.user', 'user')
      .innerJoinAndSelect('step_participants.step', 'step')
      .where('step.id = :stepId', { stepId: dto.stepId })
      .andWhere('step.process_id = :processId', { processId: dto.processId });

    if (dto.userIds && dto.userIds.length) {
      query.andWhere('processParticipant.user_id IN (:...userIds)', { userIds: dto.userIds });
    }
    return query.getMany();
  }

  async findAllByUserIdsOrFail(dto: { stepId: number; processId: string; userIds?: number[] | null }) {
    const stepParticipants = await this.findAllByUserIds(dto);
    if (!stepParticipants.length) {
      throw new NotFoundException(
        `Step participants not found for stepId: ${dto.stepId} and processId: ${dto.processId}`,
      );
    }
    return stepParticipants;
  }

  async findWithReactionAndForm(dto: {
    processId: string;
    stepId: number;
    userId: number;
  }): Promise<StepParticipantsEntity | null> {
    return this.repo
      .createQueryBuilder('step_participants')
      .innerJoinAndSelect('step_participants.processParticipant', 'processParticipant')
      .innerJoinAndSelect('processParticipant.user', 'user')
      .innerJoinAndSelect('step_participants.step', 'step')
      .leftJoinAndSelect('step_participants.filledForm', 'filledForm')
      .leftJoinAndSelect('step_participants.mainReaction', 'mainReaction')
      .where('step.id = :stepId', { stepId: dto.stepId })
      .andWhere('step.process_id = :processId', { processId: dto.processId })
      .andWhere('processParticipant.user_id = :userId', { userId: dto.userId })
      .getOne();
  }

  async findWithReactionAndFormOrFail(dto: { processId: string; stepId: number; userId: number }) {
    const stepParticipant = await this.findWithReactionAndForm(dto);
    if (!stepParticipant) {
      throw new NotFoundException(
        `Step participant not found for stepId: ${dto.stepId} and processId: ${dto.processId}`,
      );
    }
    return stepParticipant;
  }

  async saveWithFilledForm(dto: { filledForm: FormSchemaFilledEntity; stepParticipant: StepParticipantsEntity }) {
    const qr = this.repo.manager.connection.createQueryRunner();
    await qr.startTransaction();
    try {
      const filledForm = await qr.manager.save(dto.filledForm);

      await qr.manager.update(StepParticipantsEntity, { id: dto.stepParticipant.id }, { filledForm });

      await qr.commitTransaction();
    } catch (error) {
      await qr.rollbackTransaction();
      throw new Error(error);
    } finally {
      await qr.release();
    }
  }
}
