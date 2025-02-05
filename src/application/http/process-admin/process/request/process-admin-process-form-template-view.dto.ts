import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ProcessAdminProcessFormTemplateViewDto {
  @UuidProperty()
  processId: string;

  @IdProperty()
  formSchemaId: number;
}
