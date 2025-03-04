import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { AuthJwtTokenService } from '@domain/auth/services/auth-jwt-token.service';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '@domain/user/repository/user.repository';
import { AuthValidator } from '@domain/auth/validators/auth.validator';
import { UserAuthTokensRepository } from '@domain/user/repository/user-auth-tokens.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authJwtTokenService: AuthJwtTokenService,
    private readonly userRepository: UserRepository,
    private readonly authValidator: AuthValidator,
    private readonly userAuthTokensRepository: UserAuthTokensRepository,
  ) {}

  private async checkPasswordHash(dto: { enteredPassword: string; hashedPassword: string }): Promise<boolean> {
    return bcrypt.compare(dto.enteredPassword, dto.hashedPassword);
  }

  async login(dto: { email: string; password: string }): Promise<UserAuthTokensEntity> {
    const user: UserEntity = await this.userRepository.findByEmailWithPasswordDataOrFail(dto.email);

    this.authValidator.validateUserLogin(user);

    const isCorrectPassword: boolean = await this.checkPasswordHash({
      enteredPassword: dto.password,
      hashedPassword: user.password.password,
    });

    if (!isCorrectPassword) {
      throw new BadRequestException('Incorrect email or password');
    }

    const newAuthToken: UserAuthTokensEntity = await this.authJwtTokenService.generateNewTokensWithExpirationDates(
      user,
    );

    await this.userAuthTokensRepository.saveWithUser(newAuthToken);

    return newAuthToken;
  }
}
