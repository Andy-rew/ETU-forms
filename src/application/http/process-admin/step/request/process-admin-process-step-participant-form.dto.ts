import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminProcessStepParticipantFormDto {
  @UuidProperty()
  processId: string;

  @IdProperty({ description: 'id этапа' })
  stepId: number;

  @IdProperty({ description: 'id пользователя участника процесса' })
  userId: number;
}
