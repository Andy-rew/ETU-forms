import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ExpertProcessStepsParticipantsReactionAllDto {
  @IdProperty()
  stepId: number;
}
