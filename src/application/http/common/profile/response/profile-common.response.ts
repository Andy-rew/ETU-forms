import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { EmailProperty } from '@applications/decorators/api/common/email-property.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { BoolProperty } from '@ivankrtv/openapidoc/dist';

export class ProfileCommonResponse {
  @IdProperty()
  id: number;

  @TextProperty()
  name: string;

  @TextProperty()
  surname: string;

  @TextProperty({ nullable: true })
  patronymic: string | null;

  @EmailProperty()
  email: string;

  @BoolProperty({ description: 'Разрешено ли редактирование профиля (Если пользователь принадлежит ЛЭТИ, то нельзя)' })
  allowEdit: boolean;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.surname = user.surname;
    this.patronymic = user.patronymic;
    this.email = user.email;
    this.allowEdit = user.etuId === null;
  }
}
