import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ProcessAdminProcessFormFilledViewDto {
  @UuidProperty()
  processId: string;

  @IdProperty()
  filledFormId: number;

  @IdProperty()
  formSchemaId: number;
}
