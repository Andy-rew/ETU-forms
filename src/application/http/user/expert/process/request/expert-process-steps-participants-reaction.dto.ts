import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ExpertProcessStepsParticipantsReactionDto {
  @UuidProperty()
  processId: string;

  @IdProperty()
  stepId: number;

  @IdProperty({
    description: 'Id участника этапа',
  })
  participantId: number;
}
