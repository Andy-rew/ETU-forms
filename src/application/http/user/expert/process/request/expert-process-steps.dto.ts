import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ExpertProcessStepsDto {
  @UuidProperty()
  id: string;
}
