import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminProcessViewDto {
  @UuidProperty()
  id: string;
}
