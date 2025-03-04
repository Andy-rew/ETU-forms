import { Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { CommonAuthPayload } from '@domain/auth/types/common-auth-payload';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';

@Injectable()
export class AuthTokenManager {
  generateCommonAuthPayload(user: UserEntity): CommonAuthPayload {
    return {
      id: user.id,
    };
  }

  createAuthTokenEntity(dto: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiredAt: Date;
    refreshTokenExpiredAt: Date;
    user: UserEntity;
  }): UserAuthTokensEntity {
    const userAuthTokensEntity = new UserAuthTokensEntity();
    userAuthTokensEntity.accessToken = dto.accessToken;
    userAuthTokensEntity.refreshToken = dto.refreshToken;
    userAuthTokensEntity.accessTokenExpiredAt = dto.accessTokenExpiredAt;
    userAuthTokensEntity.refreshTokenExpiredAt = dto.refreshTokenExpiredAt;
    userAuthTokensEntity.user = dto.user;
    return userAuthTokensEntity;
  }
}
