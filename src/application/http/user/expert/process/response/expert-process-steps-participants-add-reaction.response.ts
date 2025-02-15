import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';

export class ExpertProcessStepsParticipantsAddReactionResponse {
  @IdProperty({ description: 'Id реакции' })
  id: number;

  constructor(reaction: ReactionEntity) {
    this.id = reaction.id;
  }
}
