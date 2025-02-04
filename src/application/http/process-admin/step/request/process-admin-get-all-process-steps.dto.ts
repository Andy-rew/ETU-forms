import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminGetAllProcessStepsDto {
  @UuidProperty()
  processId: string;
}
