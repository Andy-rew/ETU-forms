import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { BoolProperty } from '@ivankrtv/openapidoc/dist';
import { IsBoolean } from 'class-validator';

export class ProcessAdminProcessLinkAccessDto {
  @IdProperty({ description: 'Id процесса' })
  id: number;

  @BoolProperty({ description: 'Флаг доступа к процессу по ссылке' })
  @IsBoolean()
  linkAccess: boolean;
}
