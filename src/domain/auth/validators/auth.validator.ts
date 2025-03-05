import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { ValidationException } from '@app/exceptions/inherited-exceptions/common/validation.exception';
import { CommonAuthPayload } from '@domain/auth/types/common-auth-payload';
import { JwtService } from '@nestjs/jwt';
import { UserPasswordEntity } from '@domain/user/entities/user-password.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthValidator {
  constructor(
    @Inject('AuthJwtAccessTokenService') private readonly accessJwtService: JwtService,
    @Inject('AuthJwtRefreshTokenService') private readonly refreshJwtService: JwtService,
  ) {}

  validateUserSignIn(user: UserEntity) {
    if (user.status !== UserStatusEnum.activated) {
      throw new ValidationException('User is not activated. You Should register by link on your email');
    }

    if (user.deletedAt !== null) {
      throw new ValidationException('User is deleted. Contact admin for re-invite');
    }
  }

  validateUserActivationCodeSignUp(dto: { userPassword: UserPasswordEntity; password: string; samePassword: string }) {
    if (dayjs().isAfter(dto.userPassword.activationCodeExpiredAt)) {
      throw new BadRequestException('Activation code is expired');
    }

    if (dto.password !== dto.samePassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (dto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    if (dto.userPassword.user.status === UserStatusEnum.activated) {
      throw new BadRequestException('User is already activated');
    }
  }

  async validateAndVerifyAccessToken(token: string): Promise<CommonAuthPayload> {
    try {
      return this.accessJwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Invalid access token');
    }
  }

  async validateAndVerifyRefreshToken(token: string): Promise<CommonAuthPayload> {
    try {
      return this.refreshJwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }
}
