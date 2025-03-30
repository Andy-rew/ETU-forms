import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ExpertProcessStepsParticipantsFormDto {
  @UuidProperty()
  processId: string;

  @IdProperty()
  stepId: number;

  @IdProperty({ description: 'Id заполненной формы этапа/реакции' })
  formId: number;

  @IdProperty()
  schemaId: number;
}
