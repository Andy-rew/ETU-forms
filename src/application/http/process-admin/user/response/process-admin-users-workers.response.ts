import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { UserDepartmentsEntity } from '@domain/user/entities/user-departments.entity';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { CountProperty } from '@applications/decorators/api/common/count.property.decorator';

class ProcessAdminUsersWorkersUserDepartmentItem {
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

export class ProcessAdminUsersWorkersUserItem {
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
    item: ProcessAdminUsersWorkersUserDepartmentItem,
    description: 'Список кафедр и должностей пользователя как сотрудника',
    nullable: true,
  })
  userDepartments: ProcessAdminUsersWorkersUserDepartmentItem[] | null;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.surname = user.surname;
    this.patronymic = user.patronymic;
    this.email = user.email;
    this.userDepartments = user.userDepartments.map((dep) => new ProcessAdminUsersWorkersUserDepartmentItem(dep));
  }
}

export class ProcessAdminUsersWorkersResponse {
  @ArraySchemasProperty({ item: ProcessAdminUsersWorkersUserItem, description: 'Список пользователей' })
  items: ProcessAdminUsersWorkersUserItem[];

  @CountProperty()
  count: number;

  constructor(users: UserEntity[], count: number) {
    this.items = users.map((user) => new ProcessAdminUsersWorkersUserItem(user));
    this.count = count;
  }
}
