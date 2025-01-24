import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class SystemAdminUserDeleteDto {
  @IdProperty()
  id: number;
}
