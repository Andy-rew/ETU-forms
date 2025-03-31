import { Injectable } from '@nestjs/common';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { UserEntity } from '@domain/user/entities/user.entity';
import { StepParticipantsRepository } from '@domain/step/repository/step-participants.repository';
import { StepRepository } from '@domain/step/repository/step.repository';
import { FormSchemaRepository } from '@domain/form-schema/repository/form-schema.repository';
import { ReactionManager } from '@domain/reaction/manager/reaction.manager';
import { ReactionRepository } from '@domain/reaction/repository/reaction.repository';
import { StepExpertsParticipantsRepository } from '@domain/step/repository/step-experts-participants.repository';
import { StepExpertsRepository } from '@domain/step/repository/step-experts.repository';

@Injectable()
export class CommonReactionService {
  constructor(
    private readonly stepParticipantsRepository: StepParticipantsRepository,
    private readonly stepRepository: StepRepository,
    private readonly formSchemaRepository: FormSchemaRepository,
    private readonly reactionManager: ReactionManager,
    private readonly reactionRepository: ReactionRepository,
    private readonly stepExpertsParticipantsRepository: StepExpertsParticipantsRepository,
    private readonly stepExpertsRepository: StepExpertsRepository,
  ) {}

  async createReactionByUser(dto: {
    processId: string;
    stepId: number;
    userId: number;
    schemaId: number;
    type: ReactionTypeEnum;
    filledReaction: JSON;
    userReactedBy: UserEntity;
  }) {
    await this.stepRepository.findByProcessAndFormSchemaIdOrFail({
      processId: dto.processId,
      formSchemaId: dto.schemaId,
      stepId: dto.stepId,
    });

    const stepParticipant = await this.stepParticipantsRepository.findWithReactionAndFormOrFail({
      processId: dto.processId,
      stepId: dto.stepId,
      userId: dto.userId,
    });

    const stepExpert = await this.stepExpertsRepository.findByStepIdAndProcessIdOrFail({
      stepId: dto.stepId,
      processId: dto.processId,
      userId: dto.userReactedBy.id,
    });

    const stepExpertParticipant = await this.stepExpertsParticipantsRepository.findByStepParticipantAndExpertOrFail({
      stepParticipant,
      stepExpert,
    });

    const formSchema = await this.formSchemaRepository.findByIdOrFail(dto.schemaId);

    const reactionForCreate = this.reactionManager.createEntity({
      stepExpertParticipant,
      stepParticipant,
      formSchema,
      type: dto.type,
      filledReaction: dto.filledReaction,
      userReactedBy: dto.userReactedBy,
    });

    return this.reactionRepository.saveWithFilledFormTransaction(reactionForCreate);
  }
}
