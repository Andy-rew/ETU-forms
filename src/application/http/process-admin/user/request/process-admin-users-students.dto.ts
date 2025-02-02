import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';

export class ProcessAdminUsersStudentsDto {
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
    description: 'Фильтр по группе',
    isOptional: true,
    example: '9372',
  })
  groupFilter?: string;

  @TextProperty({
    description: 'Фильтр по специальности',
    isOptional: true,
    example: '09.04.02',
  })
  specialtyFilter?: string;
}
