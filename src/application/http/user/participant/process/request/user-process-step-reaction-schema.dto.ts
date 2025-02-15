import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class UserProcessStepReactionSchemaDto {
  @UuidProperty('Id процесса')
  processId: string;

  @IdProperty()
  stepId: number;

  @IdProperty({ description: 'Id шаблона реакции' })
  reactionSchemaId: number;
}
