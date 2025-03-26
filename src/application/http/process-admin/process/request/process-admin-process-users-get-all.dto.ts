import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { ProcessUsersTypeEnum } from '@domain/process/enums/process-users-type.enum';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { LimitProperty } from '@applications/decorators/api/common/limit.property.decorator';
import { OffsetProperty } from '@applications/decorators/api/common/offset.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';

export class ProcessAdminProcessUsersGetAllDto {
  @UuidProperty('Процесс, в рамках которого работаем (необходим для проверки прав доступа)')
  processId: string;

  @EnumApiProperty({ enum: ProcessUserRoleEnum, description: 'Роль пользователя в процессе', isOptional: true })
  role?: ProcessUserRoleEnum;

  @EnumApiProperty({ enum: ProcessUsersTypeEnum, description: 'Тип пользователей в системе', isOptional: true })
  userType?: ProcessUsersTypeEnum;

  @LimitProperty()
  limit: number;

  @OffsetProperty()
  offset: number;

  @IdProperty({ description: 'Id этапа процесса, Передавать только если role = expert', isOptional: true })
  stepId?: number;

  @EnumApiProperty({ enum: UserStatusEnum, description: 'Статус пользователя', isOptional: true })
  userStatus?: UserStatusEnum;

  @TextProperty({ description: 'Фильтр по имени', example: 'Иван', isOptional: true })
  nameFilter?: string;

  @TextProperty({ description: 'Фильтр по фамилии', example: 'Иванов', isOptional: true })
  surnameFilter?: string;

  @TextProperty({ description: 'Фильтр по отчеству', example: 'Иванович', isOptional: true })
  patronymicFilter?: string;

  @TextProperty({ description: 'Фильтр по email', example: 'email@example.com', isOptional: true })
  emailFilter?: string;

  @TextProperty({
    description: 'Фильтр по кафедре, Передавать только если userType = students ИЛИ workers',
    isOptional: true,
    example: 'АПУ',
  })
  departmentFilter?: string;

  @TextProperty({
    description: 'Фильтр по группе, Передавать только если userType = students',
    isOptional: true,
    example: '9372',
  })
  groupFilter?: string;

  @TextProperty({
    description: 'Фильтр по специальности, Передавать только если userType = students',
    isOptional: true,
    example: '09.04.02',
  })
  specialtyFilter?: string;

  @TextProperty({
    description: 'Фильтр по должности, Передавать только если userType = workers',
    isOptional: true,
    example: 'Доцент',
  })
  positionFilter?: string;

  @TextProperty({
    description: 'Фильтр по категории, Передавать только если userType = workers',
    isOptional: true,
    example: 'ППС',
  })
  categoryFilter?: string;
}
