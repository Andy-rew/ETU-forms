import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ExpertProcessStepsParticipantsReactionMainDto {
  @IdProperty({ description: 'Id реакции' })
  reactionId: number;
}
