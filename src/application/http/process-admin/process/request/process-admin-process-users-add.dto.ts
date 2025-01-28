import { ArrayPrimitiveProperty } from '@applications/decorators/api/helpers/array-primitive-property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ProcessAdminProcessUsersAddDto {
  @EnumApiProperty({ enum: ProcessUserRoleEnum, description: 'Роль пользователя в процессе' })
  userType: ProcessUserRoleEnum;

  @UuidProperty()
  processId: string;

  @IdProperty({ description: 'Id этапа процесса (передавать значение если эксперт иначе null)', nullable: true })
  stepId: number | null;

  @ArrayPrimitiveProperty({ description: 'Список email-адресов', items: 'email' })
  emails: string[];
}
