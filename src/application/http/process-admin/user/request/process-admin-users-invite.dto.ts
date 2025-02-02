import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';

export class ProcessAdminUsersInviteDto {
  @EnumApiProperty({ enum: ProcessUserRoleEnum, description: 'Роль пользователя в процессе' })
  role: ProcessUserRoleEnum;

  @IdProperty({ description: 'Id пользователя' })
  userId: number;

  @IdProperty({ description: 'Id процесса' })
  processId: number;
}
