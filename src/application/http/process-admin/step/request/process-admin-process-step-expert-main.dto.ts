import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminProcessStepExpertMainDto {
  @IdProperty({ description: 'Id эксперта' })
  userExpertId: number;

  @IdProperty({ description: 'Id этапа' })
  stepId: number;

  @UuidProperty()
  processId: string;
}
