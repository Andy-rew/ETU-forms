import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ExpertProcessStepsSchemaDto {
  @UuidProperty()
  processId: string;

  @IdProperty()
  stepId: number;

  @IdProperty({ description: 'Id шаблона формы этапа/реакции' })
  schemaId: number;
}
