import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { JwtTokenProperty } from '@applications/decorators/api/common/jwt-token-property.decorator';
import { DateWithTimeProperty } from '@applications/decorators/api/common/date-time.property.decorator';

export class AuthSignInResponse {
  @JwtTokenProperty({ description: 'access JWT токен' })
  accessToken: string;

  @JwtTokenProperty({ description: 'refresh JWT токен' })
  refreshToken: string;

  @DateWithTimeProperty({ description: 'Дата и время истечения access JWT токена' })
  accessTokenExpiredAt: Date;

  @DateWithTimeProperty({ description: 'Дата и время истечения refresh JWT токена' })
  refreshTokenExpiredAt: Date;

  @EnumApiProperty({ enum: UserRoleEnum, description: 'Роль' })
  role: UserRoleEnum;

  constructor() {}
}
