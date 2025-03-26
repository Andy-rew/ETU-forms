import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';

export class ProcessAdminProcessStatusChangeDto {
  @UuidProperty()
  processId: string;

  @EnumApiProperty({ enum: ProcessStatusEnum, description: 'Статус процесса' })
  status: ProcessStatusEnum;
}
