import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { AuthJwtTokenService } from '@domain/auth/services/auth-jwt-token.service';
import { UserRepository } from '@domain/user/repository/user.repository';
import { AuthValidator } from '@domain/auth/validators/auth.validator';
import { UserAuthTokensRepository } from '@domain/user/repository/user-auth-tokens.repository';
import { UserPasswordRepository } from '@domain/user/repository/user-password.repository';
import { AuthManager } from '@domain/auth/managers/auth.manager';
import { UserPasswordEntity } from '@domain/user/entities/user-password.entity';
import { AuthUtilsService } from '@domain/auth/services/auth-utils.service';
import { CommonAuthPayload } from '@domain/auth/types/common-auth-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly authJwtTokenService: AuthJwtTokenService,
    private readonly userRepository: UserRepository,
    private readonly authValidator: AuthValidator,
    private readonly userAuthTokensRepository: UserAuthTokensRepository,
    private readonly userPasswordRepository: UserPasswordRepository,
    private readonly authManager: AuthManager,
    private readonly passwordUtilsService: AuthUtilsService,
  ) {}

  async signIn(dto: { email: string; password: string }): Promise<UserAuthTokensEntity> {
    const user: UserEntity = await this.userRepository.findByEmailWithPasswordDataOrFail(dto.email);

    this.authValidator.validateUserSignIn(user);

    await this.passwordUtilsService.checkPasswordHashOrFail({
      enteredPassword: dto.password,
      hashedPassword: user.password.password,
    });

    const newAuthTokenEntity: UserAuthTokensEntity =
      await this.authJwtTokenService.generateNewTokensWithExpirationDates(user);

    return this.userAuthTokensRepository.save(newAuthTokenEntity);
  }

  async signUpByActivationCode(dto: {
    activationCode: string;
    password: string;
    samePassword: string;
  }): Promise<UserPasswordEntity> {
    const userPassword = await this.userPasswordRepository.finByActivationCodeOrFail(dto.activationCode);

    this.authValidator.validateUserActivationCodeSignUp({
      userPassword,
      password: dto.password,
      samePassword: dto.samePassword,
    });

    const hashedPassword = await this.passwordUtilsService.hashPassword(dto.password);

    const userPasswordEntity = this.authManager.createUserSignUpEntity({
      userPassword,
      hashedPassword,
    });

    return this.userPasswordRepository.saveWithUserTransaction(userPasswordEntity);
  }

  async refreshTokens(dto: { refreshToken: string; currentUser: UserEntity }): Promise<UserAuthTokensEntity> {
    const payload: CommonAuthPayload = await this.authValidator.validateAndVerifyRefreshToken(dto.refreshToken);

    if (payload.id !== dto.currentUser.id) {
      throw new BadRequestException('You are bad man. Use your own refresh token');
    }

    const userToken: UserAuthTokensEntity = await this.userAuthTokensRepository.findByRefreshTokenAndUserIdOrFail({
      refreshToken: dto.refreshToken,
      userId: payload.id,
    });

    const newAuthTokenEntity: UserAuthTokensEntity =
      await this.authJwtTokenService.generateNewTokensWithExpirationDates(userToken.user);

    const refreshedTokens = this.authManager.refreshTokens({ oldTokens: userToken, newTokens: newAuthTokenEntity });

    return this.userAuthTokensRepository.save(refreshedTokens);
  }

  async signOut(dto: { accessToken: string; userId: number }): Promise<void> {
    await this.userAuthTokensRepository.deleteByAccessTokenAndUserId({
      accessToken: dto.accessToken,
      userId: dto.userId,
    });
  }
}
