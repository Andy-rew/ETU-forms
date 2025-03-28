import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class UserProcessStepSchemaDto {
  @UuidProperty('Id процесса')
  processId: string;

  @IdProperty()
  stepId: number;
}
