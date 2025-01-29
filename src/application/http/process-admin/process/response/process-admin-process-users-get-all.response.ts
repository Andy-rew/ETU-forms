import { UserEntity } from '@domain/user/entities/user.entity';
import { CountProperty } from '@applications/decorators/api/common/count.property.decorator';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { UserDepartmentsEntity } from '@domain/user/entities/user-departments.entity';
import { EducationEntity } from '@domain/user/entities/education.entity';

class ProcessAdminProcessUsersGetAllUserDepartmentsItem {
  @TextProperty({ description: 'Название кафедры', example: 'АПУ' })
  departmentTitle: string;

  @TextProperty({ description: 'Название должности', example: 'Доцент' })
  positionTitle: string;

  @TextProperty({ description: 'Название категории', example: 'ППС' })
  categoryTitle: string;

  constructor(userDepartment: UserDepartmentsEntity) {
    this.categoryTitle = userDepartment.category.title;
    this.departmentTitle = userDepartment.department.title;
    this.positionTitle = userDepartment.position.title;
  }
}

class ProcessAdminProcessUsersGetAllUserEducationItem {
  @TextProperty({ description: 'Название группы', example: '9372' })
  groupTitle: string;

  @TextProperty({ description: 'Шифр специальности', example: '09.02.01' })
  specialtyCipher: string;

  @TextProperty({ description: 'Название кафедры', example: 'АПУ' })
  departmentTitle: string;

  constructor(education: EducationEntity) {
    this.groupTitle = education.group.title;
    this.specialtyCipher = education.group.specialty.cipher;
    //todo кафедра
    // this.departmentTitle = education.department.title;
  }
}

export class ProcessAdminProcessUsersGetAllUserItem {
  @IdProperty()
  id: number;

  @TextProperty({ description: 'Имя пользователя' })
  name: string;

  @TextProperty({ description: 'Фамилия пользователя' })
  surname: string;

  @TextProperty({ description: 'Отчество пользователя' })
  patronymic: string;

  @TextProperty({ description: 'Email пользователя' })
  email: string;

  @ArraySchemasProperty({
    item: ProcessAdminProcessUsersGetAllUserDepartmentsItem,
    description: 'Список кафедр и должностей пользователя как сотрудника',
    nullable: true,
  })
  userDepartments: ProcessAdminProcessUsersGetAllUserDepartmentsItem[] | null;

  @ArraySchemasProperty({
    item: ProcessAdminProcessUsersGetAllUserEducationItem,
    description: 'Список обучений пользователя как студента',
    nullable: true,
  })
  educations: ProcessAdminProcessUsersGetAllUserEducationItem[] | null;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.surname = user.surname;
    this.patronymic = user.patronymic;
    this.email = user.email;
    this.userDepartments = user.userDepartments.map(
      (dep) => new ProcessAdminProcessUsersGetAllUserDepartmentsItem(dep),
    );
    this.educations = user.educations.map((edu) => new ProcessAdminProcessUsersGetAllUserEducationItem(edu));
  }
}

export class ProcessAdminProcessUsersGetAllResponse {
  @ArraySchemasProperty({ item: ProcessAdminProcessUsersGetAllUserItem, description: 'Список пользователей' })
  items: ProcessAdminProcessUsersGetAllUserItem[];

  @CountProperty()
  count: number;

  constructor(users: UserEntity[], count: number) {
    this.items = users.map((user) => new ProcessAdminProcessUsersGetAllUserItem(user));
    this.count = count;
  }
}
