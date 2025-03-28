import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReactionRepository {
  constructor(@InjectRepository(ReactionEntity) private readonly repo: Repository<ReactionEntity>) {}

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
}
