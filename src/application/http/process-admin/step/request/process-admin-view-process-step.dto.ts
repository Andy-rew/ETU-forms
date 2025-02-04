import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminViewProcessStepDto {
  @IdProperty({ description: 'Id этапа' })
  stepId: number;

  @UuidProperty('Id процесса')
  processId: string;
}
