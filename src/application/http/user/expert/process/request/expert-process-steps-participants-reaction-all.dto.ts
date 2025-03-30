import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ExpertProcessStepsParticipantsReactionAllDto {
  @UuidProperty()
  processId: string;

  @IdProperty()
  stepId: number;

  @IdProperty({
    description: 'Id пользователя-участника этапа',
  })
  userId: number;
}
