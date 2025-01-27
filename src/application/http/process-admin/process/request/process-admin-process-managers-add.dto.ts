import { ArrayPrimitiveProperty } from '@applications/decorators/api/helpers/array-primitive-property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminProcessManagersAddDto {
  @UuidProperty()
  processId: string;

  @ArrayPrimitiveProperty({ description: 'Список email-адресов', items: 'email' })
  emails: string[];
}
