import { JwtTokenProperty } from '@applications/decorators/api/common/jwt-token-property.decorator';

export class AuthRefreshDto {
  @JwtTokenProperty({ description: 'refresh JWT токен' })
  refreshToken: string;
}
