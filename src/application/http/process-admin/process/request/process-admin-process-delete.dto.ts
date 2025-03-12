import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminProcessDeleteDto {
  @UuidProperty()
  processId: string;
}
