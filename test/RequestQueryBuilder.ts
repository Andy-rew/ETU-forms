import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
//import { AuthJwtTokenRepository } from '@domain/auth-jwt-token/auth-jwt-token.repository';

export class RequestQueryBuilder {
  private bodyVal: string | object | null = null;

  private authTokenData: UserAuthTokensEntity = null;

  constructor(
    private readonly app: INestApplication,
    private SARequest: request.Request,
    tokens: UserAuthTokensEntity = null,
  ) {
    this.authTokenData = tokens;
  }

  public query(val: string | Record<string, any>): RequestQueryBuilder {
    this.SARequest = this.SARequest.query(val);
    return this;
  }

  public body(val: string | object): RequestQueryBuilder {
    this.bodyVal = val;
    return this;
  }

  public async execute(): Promise<request.Request> {
    if (this.authTokenData) {
      // await this.app.get(AuthJwtTokenRepository).save(this.authTokenData);
    }

    if (this.bodyVal !== null) {
      return this.SARequest.send(this.bodyVal);
    }

    return this.SARequest.send();
  }
}
