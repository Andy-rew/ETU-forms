import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class UserProcessMyStepsDto {
  @UuidProperty()
  id: string;
}
