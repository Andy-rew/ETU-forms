import { JwtTokenProperty } from '@applications/decorators/api/common/jwt-token-property.decorator';
import { DateWithTimeProperty } from '@applications/decorators/api/common/date-time.property.decorator';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { EmailProperty } from '@applications/decorators/api/common/email-property.decorator';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { ArrayPrimitiveProperty } from '@applications/decorators/api/helpers/array-primitive-property.decorator';
import { ObjectProperty } from '@ivankrtv/openapidoc/dist';

class AuthSignInUserItem {
  @IdProperty()
  id: number;

  @TextProperty()
  name: string;

  @TextProperty()
  surname: string;

  @TextProperty()
  patronymic: string;

  @EmailProperty()
  email: string;

  @ArrayPrimitiveProperty({ items: 'enum', enum: UserRoleEnum })
  roles: UserRoleEnum[];

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.surname = user.surname;
    this.patronymic = user.patronymic;
    this.email = user.email;
    this.roles = user.roles;
  }
}

export class AuthSignInResponse {
  @JwtTokenProperty({ description: 'access JWT токен' })
  accessToken: string;

  @JwtTokenProperty({ description: 'refresh JWT токен' })
  refreshToken: string;

  @DateWithTimeProperty({ description: 'Дата и время истечения access JWT токена' })
  accessTokenExpiredAt: Date;

  @DateWithTimeProperty({ description: 'Дата и время истечения refresh JWT токена' })
  refreshTokenExpiredAt: Date;

  @ObjectProperty({ description: 'Пользователь' })
  user: AuthSignInUserItem;

  constructor(userAuthToken: UserAuthTokensEntity) {
    this.accessToken = userAuthToken.accessToken;
    this.refreshToken = userAuthToken.refreshToken;
    this.accessTokenExpiredAt = userAuthToken.accessTokenExpiredAt;
    this.refreshTokenExpiredAt = userAuthToken.refreshTokenExpiredAt;
    this.user = new AuthSignInUserItem(userAuthToken.user);
  }
}
