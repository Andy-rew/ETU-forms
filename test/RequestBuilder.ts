import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { RequestQueryBuilder } from './RequestQueryBuilder';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import {
  JwtAccessConfig,
  JwtRefreshConfig,
} from '../config/configuration/configuration';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { JwtService } from '@nestjs/jwt';

export class RequestBuilder {
  private authToken: string = null;
  private readonly jwtAccessService: JwtService;

  private readonly jwtAccessConfig: JwtAccessConfig;
  private readonly jwtRefreshConfig: JwtRefreshConfig;

  private authTokensData: UserAuthTokensEntity = null;

  constructor(
    private readonly app: INestApplication,
    readonly configService: ConfigService,
  ) {
    this.jwtAccessService = this.app.get('AuthJwtAccessTokenService');
    this.jwtAccessConfig = configService.get<JwtAccessConfig>('jwtAccess');
    this.jwtRefreshConfig = configService.get<JwtRefreshConfig>('jwtRefresh');
  }

  public post(url: string): RequestQueryBuilder {
    const isNotAuthAccess =
      this.authToken === null && this.authTokensData === null;

    if (isNotAuthAccess) {
      return new RequestQueryBuilder(
        this.app,
        request(this.app.getHttpServer()).post(url),
      );
    }

    if (this.authToken) {
      return new RequestQueryBuilder(
        this.app,
        request(this.app.getHttpServer())
          .post(url)
          .set('Authorization', `Bearer ${this.authToken}`),
      );
    }

    if (this.authTokensData) {
      // todo
      // return new RequestQueryBuilder(
      //   this.app,
      //   request(this.app.getHttpServer())
      //     .post(url)
      //     .set('Authorization', `Bearer ${this.authTokensData.accessToken}`),
      //   this.authTokensData,
      // );
    }

    throw new Error('Something went wrong');
  }

  public get(url: string): RequestQueryBuilder {
    const isNotAuthAccess =
      this.authToken === null && this.authTokensData === null;

    if (isNotAuthAccess) {
      return new RequestQueryBuilder(
        this.app,
        request(this.app.getHttpServer()).get(url),
      );
    }

    if (this.authToken) {
      return new RequestQueryBuilder(
        this.app,
        request(this.app.getHttpServer())
          .get(url)
          .set('Authorization', `Bearer ${this.authToken}`),
      );
    }

    if (this.authTokensData) {
      // todo
      // return new RequestQueryBuilder(
      //   this.app,
      //   request(this.app.getHttpServer())
      //     .get(url)
      //     .set('Authorization', `Bearer ${this.authTokensData.accessToken}`),
      //   this.authTokensData,
      // );
    }

    throw new Error('Something went wrong');
  }

  /**
   * Метод withAuth принимает пользователя или того, что может быть авторизован.
   * Использует сервис генерации токена и кладет его в приватный параметр,
   * после чего токен используется в запросе.
   */
  public withAuth(user: UserEntity): this {
    // todo
    // const payload: GeneralPayloadType = {
    //   userId: user.id,
    //   isBan: user.ban,
    //   isActive: user.isActive,
    // };
    //
    // const accessToken = this.jwtAccessService.sign(payload, {
    //   expiresIn: this.jwtAccessConfig.accessExpireTime,
    //   secret: this.jwtAccessConfig.accessSecret,
    // });
    //
    // const refreshToken = this.jwtAccessService.sign(payload, {
    //   expiresIn: this.jwtRefreshConfig.refreshExpireTime,
    //   secret: this.jwtRefreshConfig.refreshSecret,
    // });
    //
    // const authTokenData = new UserAuthTokensEntity();
    // todo
    // authTokenData.accessToken = accessToken;
    // authTokenData.refreshToken = refreshToken;
    // authTokenData.user = user;
    //
    // this.authTokensData = authTokenData;
    return this;
  }

  public setAuthToken(token: string): RequestBuilder {
    this.authToken = token;
    return this;
  }
}
