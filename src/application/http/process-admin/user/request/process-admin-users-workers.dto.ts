import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';

export class ProcessAdminUsersWorkersDto {
  @TextProperty({ description: 'Фильтр по имени', example: 'Иван', isOptional: true })
  nameFilter?: string;

  @TextProperty({ description: 'Фильтр по фамилии', example: 'Иванов', isOptional: true })
  surnameFilter?: string;

  @TextProperty({ description: 'Фильтр по отчеству', example: 'Иванович', isOptional: true })
  patronymicFilter?: string;

  @TextProperty({ description: 'Фильтр по email', example: 'email@example.com', isOptional: true })
  emailFilter?: string;

  @TextProperty({
    description: 'Фильтр по кафедре',
    isOptional: true,
    example: 'АПУ',
  })
  departmentFilter?: string;

  @TextProperty({
    description: 'Фильтр по должности',
    isOptional: true,
    example: 'Доцент',
  })
  positionFilter?: string;

  @TextProperty({
    description: 'Фильтр по категории',
    isOptional: true,
    example: 'ППС',
  })
  categoryFilter?: string;
}
