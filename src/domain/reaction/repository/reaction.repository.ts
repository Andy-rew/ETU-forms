import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReactionRepository {
  constructor(@InjectRepository(ReactionEntity) private readonly repo: Repository<ReactionEntity>) {}

  async save(reaction: ReactionEntity) {
    return this.repo.save(reaction);
  }

  async findOneByUserStepProcess(dto: { userId: number; stepId: number; processId: string }) {
    return this.repo
      .createQueryBuilder('reaction')
      .innerJoinAndSelect('reaction.reactionFormFilled', 'reactionFormFilled')
      .innerJoinAndSelect('reaction.stepParticipant', 'stepParticipant')
      .innerJoinAndSelect('stepParticipant.processParticipant', 'processParticipant')
      .innerJoinAndSelect('processParticipant.user', 'user')
      .where('user.id = :userId', { userId: dto.userId })
      .andWhere('stepParticipant.step_id = :stepId', { stepId: dto.stepId })
      .andWhere('processParticipant.process_id = :processId', { processId: dto.processId })
      .getOne();
  }

  async findOneByUserStepProcessOrFail(dto: { userId: number; stepId: number; processId: string }) {
    const reaction = await this.findOneByUserStepProcess(dto);
    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }
    return reaction;
  }

  async findOneByStepParticipantAndExpert(dto: { stepParticipantId: number; userExpertId: number }) {
    return this.repo
      .createQueryBuilder('reaction')
      .innerJoinAndSelect('reaction.reactionFormFilled', 'reactionFormFilled')
      .innerJoinAndSelect('reaction.stepParticipant', 'stepParticipant')
      .innerJoinAndSelect('reaction.reactedByUser', 'reactedByUser')
      .where('stepParticipant.id = :stepParticipantId', { stepParticipantId: dto.stepParticipantId })
      .andWhere('reactedByUser.id = :expertId', { expertId: dto.userExpertId })
      .getOne();
  }

  async findAllForStepParticipant(stepParticipantId: number) {
    return this.repo
      .createQueryBuilder('reaction')
      .innerJoinAndSelect('reaction.reactionFormFilled', 'reactionFormFilled')
      .innerJoinAndSelect('reaction.stepParticipant', 'stepParticipant')
      .innerJoinAndSelect('reaction.reactedByUser', 'reactedByUser')
      .where('stepParticipant.id = :stepParticipantId', { stepParticipantId })
      .getMany();
  }

  async saveWithFilledFormTransaction(reaction: ReactionEntity): Promise<ReactionEntity> {
    return this.repo.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(reaction.reactionFormFilled);
      await transactionalEntityManager.save(reaction);
      await transactionalEntityManager.save(reaction.stepExpertsParticipant);
      return reaction;
    });
  }
}
