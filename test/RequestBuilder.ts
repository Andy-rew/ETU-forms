import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { RequestQueryBuilder } from './RequestQueryBuilder';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { CONFIGS, JwtAccessConfig, JwtRefreshConfig } from '../config/configuration/configuration';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { JwtService } from '@nestjs/jwt';
import { CommonAuthPayload } from '@domain/auth/types/common-auth-payload';
import * as dayjs from 'dayjs';

export class RequestBuilder {
  private authToken: string = null;
  private readonly jwtAccessService: JwtService;

  private readonly jwtAccessConfig: JwtAccessConfig;
  private readonly jwtRefreshConfig: JwtRefreshConfig;

  private authTokensData: UserAuthTokensEntity = null;

  constructor(private readonly app: INestApplication, readonly configService: ConfigService) {
    this.jwtAccessService = this.app.get('AuthJwtAccessTokenService');
    this.jwtAccessConfig = configService.get<JwtAccessConfig>(CONFIGS.jwtAccess);
    this.jwtRefreshConfig = configService.get<JwtRefreshConfig>(CONFIGS.jwtRefresh);
  }

  public post(url: string): RequestQueryBuilder {
    const isNotAuthAccess = this.authToken === null && this.authTokensData === null;

    if (isNotAuthAccess) {
      return new RequestQueryBuilder(this.app, request(this.app.getHttpServer()).post(url));
    }

    if (this.authToken) {
      return new RequestQueryBuilder(
        this.app,
        request(this.app.getHttpServer()).post(url).set('Authorization', `Bearer ${this.authToken}`),
      );
    }

    if (this.authTokensData) {
      return new RequestQueryBuilder(
        this.app,
        request(this.app.getHttpServer()).post(url).set('Authorization', `Bearer ${this.authTokensData.accessToken}`),
        this.authTokensData,
      );
    }

    throw new Error('Something went wrong');
  }

  public get(url: string): RequestQueryBuilder {
    const isNotAuthAccess = this.authToken === null && this.authTokensData === null;

    if (isNotAuthAccess) {
      return new RequestQueryBuilder(this.app, request(this.app.getHttpServer()).get(url));
    }

    if (this.authToken) {
      return new RequestQueryBuilder(
        this.app,
        request(this.app.getHttpServer()).get(url).set('Authorization', `Bearer ${this.authToken}`),
      );
    }

    if (this.authTokensData) {
      return new RequestQueryBuilder(
        this.app,
        request(this.app.getHttpServer()).get(url).set('Authorization', `Bearer ${this.authTokensData.accessToken}`),
        this.authTokensData,
      );
    }

    throw new Error('Something went wrong');
  }

  /**
   * Метод withAuth принимает пользователя или того, что может быть авторизован.
   * Использует сервис генерации токена и кладет его в приватный параметр,
   * после чего токен используется в запросе.
   */
  public withAuth(user: UserEntity): this {
    const payload: CommonAuthPayload = {
      id: user.id,
    };

    const accessToken = this.jwtAccessService.sign(payload, {
      expiresIn: Number(this.jwtAccessConfig.accessExpireTimeMinutes) * 60,
      secret: this.jwtAccessConfig.accessSecret,
    });

    const refreshToken = this.jwtAccessService.sign(payload, {
      expiresIn: Number(this.jwtRefreshConfig.refreshExpireTimeMinutes) * 60,
      secret: this.jwtRefreshConfig.refreshSecret,
    });

    const refreshExpirationDate = dayjs()
      .add(Number(this.jwtRefreshConfig.refreshExpireTimeMinutes), 'minutes')
      .toDate();

    const accessExpirationDate = dayjs().add(Number(this.jwtAccessConfig.accessExpireTimeMinutes), 'minutes').toDate();

    const authTokenData = new UserAuthTokensEntity();
    authTokenData.accessToken = accessToken;
    authTokenData.refreshToken = refreshToken;
    authTokenData.accessTokenExpiredAt = accessExpirationDate;
    authTokenData.refreshTokenExpiredAt = refreshExpirationDate;
    authTokenData.user = user;

    this.authTokensData = authTokenData;
    return this;
  }

  public setAuthToken(token: string): RequestBuilder {
    this.authToken = token;
    return this;
  }
}
