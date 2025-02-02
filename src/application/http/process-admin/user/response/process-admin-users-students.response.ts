import { UserEntity } from '@domain/user/entities/user.entity';
import { CountProperty } from '@applications/decorators/api/common/count.property.decorator';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { EducationEntity } from '@domain/user/entities/education.entity';

class ProcessAdminUsersStudentsUserEductionItem {
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

export class ProcessAdminUsersStudentsUserItem {
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
    item: ProcessAdminUsersStudentsUserEductionItem,
    description: 'Список обучений пользователя как студента',
    nullable: true,
  })
  educations: ProcessAdminUsersStudentsUserEductionItem[] | null;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.surname = user.surname;
    this.patronymic = user.patronymic;
    this.email = user.email;
    this.educations = user.educations.map((edu) => new ProcessAdminUsersStudentsUserEductionItem(edu));
  }
}

export class ProcessAdminUsersStudentsResponse {
  @ArraySchemasProperty({ item: ProcessAdminUsersStudentsUserItem, description: 'Список пользователей' })
  items: ProcessAdminUsersStudentsUserItem[];

  @CountProperty()
  count: number;

  constructor(users: UserEntity[], count: number) {
    this.items = users.map((user) => new ProcessAdminUsersStudentsUserItem(user));
    this.count = count;
  }
}
