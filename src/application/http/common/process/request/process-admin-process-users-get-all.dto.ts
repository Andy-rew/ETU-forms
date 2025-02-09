import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { ProcessUsersTypeEnum } from '@domain/process/enums/process-users-type.enum';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { BoolQueryProperty } from '@applications/decorators/api/common/bool-query.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';

export class ProcessAdminProcessUsersGetAllDto {
  @EnumApiProperty({ enum: ProcessUserRoleEnum, description: 'Роль пользователя в процессе' })
  role: ProcessUserRoleEnum;

  @EnumApiProperty({ enum: ProcessUsersTypeEnum, description: 'Тип пользователей в процессе' })
  userType: ProcessUsersTypeEnum;

  @IdProperty({ description: 'Id этапа процесса, Передавать только если role = expert', isOptional: true })
  stepId?: number;

  @BoolQueryProperty({
    description: 'Признак приглашенных пользователей, Передавать только если userType = external',
    isOptional: true,
  })
  invited?: boolean;

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
