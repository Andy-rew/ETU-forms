import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { ProcessGetAllByRoleEnum } from '@domain/process/enums/process-get-all-by-role.enum';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateProperty } from '@applications/decorators/api/common/date.property.decorator';
import { LimitProperty } from '@applications/decorators/api/common/limit.property.decorator';
import { OffsetProperty } from '@applications/decorators/api/common/offset.property.decorator';

export class ProcessAdminProcessGetAllDto {
  @EnumApiProperty({ enum: ProcessGetAllByRoleEnum, description: 'Роль текущего пользователя в процессе' })
  role: ProcessGetAllByRoleEnum;

  @LimitProperty()
  limit: number;

  @OffsetProperty()
  offset: number;

  @EnumApiProperty({ enum: ProcessStatusEnum, description: 'Фильтр по статусу процесса', isOptional: true })
  status?: ProcessStatusEnum;

  @TextProperty({ description: 'Фильтр по названию процесса', isOptional: true })
  title?: string;

  @DateProperty({ description: 'Фильтр по дате начала процесса', isOptional: true })
  startDate?: Date;

  @DateProperty({ description: 'Фильтр по дате окончания процесса', isOptional: true })
  endDate?: Date;
}
