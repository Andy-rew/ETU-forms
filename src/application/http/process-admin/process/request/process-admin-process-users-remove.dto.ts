import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';

export class ProcessAdminProcessUsersRemoveDto {
  @EnumApiProperty({ description: 'Роль пользователя в процессе', enum: ProcessUserRoleEnum })
  userType: ProcessUserRoleEnum;

  @IdProperty({ description: 'Id этапа процесса (передавать значение если эксперт иначе null)', nullable: true })
  stepId: number | null;

  @UuidProperty()
  processId: string;

  @IdProperty()
  userId: number;
}
