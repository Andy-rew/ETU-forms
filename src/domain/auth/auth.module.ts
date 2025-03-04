import { Module } from '@nestjs/common';
import { AuthManager } from '@domain/auth/managers/auth.manager';
import { AuthService } from '@domain/auth/services/auth.service';
import { AuthJwtTokenService } from '@domain/auth/services/auth-jwt-token.service';
import { AuthJwtRefreshTokenModule } from '@infrastructure/module/auth-jwt-refresh-token.module';
import { AuthJwtAccessTokenModule } from '@infrastructure/module/auth-jwt-access-token.module';
import { AuthValidator } from '@domain/auth/validators/auth.validator';
import { UserModule } from '@domain/user/user.module';
import { PasswordUtilsService } from '@domain/auth/services/password-utils.service';
import { AuthController } from '@applications/http/common/auth/auth.controller';

@Module({
  controllers: [AuthController],
  imports: [AuthJwtRefreshTokenModule, AuthJwtAccessTokenModule, UserModule],
  providers: [AuthManager, AuthService, AuthJwtTokenService, AuthValidator, PasswordUtilsService],
})
export class AuthModule {}
