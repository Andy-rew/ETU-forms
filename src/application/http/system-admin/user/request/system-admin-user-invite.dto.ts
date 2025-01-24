import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { EmailProperty } from '@applications/decorators/api/common/email-property.decorator';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';

export class SystemAdminUserInviteDto {
  @TextProperty({ description: 'Имя пользователя' })
  name: string;

  @TextProperty({ description: 'Фамилия пользователя' })
  surname: string;

  @TextProperty({ description: 'Отчество пользователя', nullable: true })
  patronymic: string;

  @EmailProperty()
  email: string;

  @EnumApiProperty({
    enum: UserRoleEnum,
    description: 'Роль пользователя',
  })
  role: UserRoleEnum;
}
