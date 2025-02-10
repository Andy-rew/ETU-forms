import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class UserProcessStepFormFilledDto {
  @UuidProperty('Id процесса')
  processId: string;

  @IdProperty()
  stepId: number;
}
