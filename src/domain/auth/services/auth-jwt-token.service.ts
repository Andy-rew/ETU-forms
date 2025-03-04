import { Inject, Injectable } from '@nestjs/common';
import { JwtAccessConfig, JwtRefreshConfig } from '../../../../config/configuration/configuration';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import * as dayjs from 'dayjs';
import { UserEntity } from '@domain/user/entities/user.entity';
import { CommonAuthPayload } from '@domain/auth/types/common-auth-payload';
import { AuthManager } from '@domain/auth/managers/auth.manager';
import { AuthJwtTokenPairType } from '@domain/auth/types/auth-jwt-token-pair.type';

@Injectable()
export class AuthJwtTokenService {
  private readonly jwtAccessConfig: JwtAccessConfig;
  private readonly jwtRefreshConfig: JwtRefreshConfig;

  constructor(
    @Inject('AuthJwtAccessTokenService') private readonly accessJwtService: JwtService,
    @Inject('AuthJwtRefreshTokenService') private readonly refreshJwtService: JwtService,
    private readonly authTokenManager: AuthManager,
    private readonly configService: ConfigService,
  ) {
    this.jwtAccessConfig = configService.get<JwtAccessConfig>('jwtAccess');
    this.jwtRefreshConfig = configService.get<JwtRefreshConfig>('jwtRefresh');
  }

  async generateTokensPair(payload: CommonAuthPayload): Promise<AuthJwtTokenPairType> {
    const accessToken = await this.accessJwtService.signAsync(payload);

    const refreshToken = await this.refreshJwtService.signAsync(payload);

    return { accessToken, refreshToken };
  }

  async generateNewTokensWithExpirationDates(user: UserEntity): Promise<UserAuthTokensEntity> {
    const payload: CommonAuthPayload = this.authTokenManager.generateCommonAuthPayload(user);

    const tokensPair: AuthJwtTokenPairType = await this.generateTokensPair(payload);

    const refreshExpirationDate = dayjs()
      .add(Number(this.jwtRefreshConfig.refreshExpireTimeMinutes), 'minutes')
      .toDate();

    const accessExpirationDate = dayjs().add(Number(this.jwtAccessConfig.accessExpireTimeMinutes), 'minutes').toDate();

    return this.authTokenManager.createAuthTokenEntity({
      accessToken: tokensPair.accessToken,
      refreshToken: tokensPair.refreshToken,
      accessTokenExpiredAt: accessExpirationDate,
      refreshTokenExpiredAt: refreshExpirationDate,
      user: user,
    });
  }
}
