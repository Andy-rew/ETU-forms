import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { ObjectProperty } from '@ivankrtv/openapidoc/dist';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';

class UserProcessStepReactionItem {
  @IdProperty({ description: 'Id заполненной реакции' })
  reactionFilledId: number;

  @IdProperty({ description: 'Id шаблона реакции' })
  reactionSchemaId: number;

  @EnumApiProperty({ enum: ReactionTypeEnum, description: 'Тип реакции' })
  type: ReactionTypeEnum;

  constructor(reaction: ReactionEntity) {
    this.reactionFilledId = reaction.reactionFormFilled.id;
    this.reactionSchemaId = reaction.reactionFormFilled.schema.id;
    this.type = reaction.type;
  }
}

export class UserProcessStepReactionResponse {
  @ObjectProperty({
    description: 'Реакция, будет null, если еще не проставлена',
    nullable: true,
  })
  reaction: UserProcessStepReactionItem | null;

  constructor(stepParticipant: StepParticipantsEntity) {
    this.reaction = stepParticipant.mainReaction ? new UserProcessStepReactionItem(stepParticipant.mainReaction) : null;
  }
}
