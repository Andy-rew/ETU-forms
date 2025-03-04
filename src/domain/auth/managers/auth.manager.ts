import { Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { CommonAuthPayload } from '@domain/auth/types/common-auth-payload';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { UserPasswordEntity } from '@domain/user/entities/user-password.entity';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';

@Injectable()
export class AuthManager {
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

  createUserSignUpEntity(dto: { userPassword: UserPasswordEntity; hashedPassword: string }): UserPasswordEntity {
    const userPasswordEntity = dto.userPassword;
    userPasswordEntity.activationCode = null;
    userPasswordEntity.password = dto.hashedPassword;

    userPasswordEntity.user.status = UserStatusEnum.activated;
    return userPasswordEntity;
  }

  refreshTokens(dto: { oldTokens: UserAuthTokensEntity; newTokens: UserAuthTokensEntity }): UserAuthTokensEntity {
    const tokens = dto.oldTokens;
    tokens.accessToken = dto.newTokens.accessToken;
    tokens.refreshToken = dto.newTokens.refreshToken;
    tokens.accessTokenExpiredAt = dto.newTokens.accessTokenExpiredAt;
    tokens.refreshTokenExpiredAt = dto.newTokens.refreshTokenExpiredAt;
    return tokens;
  }
}
