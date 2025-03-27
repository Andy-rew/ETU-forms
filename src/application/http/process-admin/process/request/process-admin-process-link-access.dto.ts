import { BoolProperty } from '@ivankrtv/openapidoc/dist';
import { IsBoolean } from 'class-validator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminProcessLinkAccessDto {
  @UuidProperty()
  processId: string;

  @BoolProperty({ description: 'Флаг доступа к процессу по ссылке' })
  @IsBoolean()
  linkAccess: boolean;
}
