import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ExpertProcessViewDto {
  @UuidProperty()
  processId: string;
}
