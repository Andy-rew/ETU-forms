import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class UserProcessViewDto {
  @UuidProperty()
  processId: string;
}
