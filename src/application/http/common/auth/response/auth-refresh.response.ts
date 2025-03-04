import { JwtTokenProperty } from '@applications/decorators/api/common/jwt-token-property.decorator';
import { DateWithTimeProperty } from '@applications/decorators/api/common/date-time.property.decorator';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';

export class AuthRefreshResponse {
  @JwtTokenProperty({ description: 'access JWT токен' })
  accessToken: string;

  @JwtTokenProperty({ description: 'refresh JWT токен' })
  refreshToken: string;

  @DateWithTimeProperty({ description: 'Дата и время истечения access JWT токена' })
  accessTokenExpiredAt: Date;

  @DateWithTimeProperty({ description: 'Дата и время истечения refresh JWT токена' })
  refreshTokenExpiredAt: Date;

  constructor(authToken: UserAuthTokensEntity) {
    this.accessToken = authToken.accessToken;
    this.refreshToken = authToken.refreshToken;
    this.accessTokenExpiredAt = authToken.accessTokenExpiredAt;
    this.refreshTokenExpiredAt = authToken.refreshTokenExpiredAt;
  }
}
