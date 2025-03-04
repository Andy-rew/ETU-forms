import { Module } from '@nestjs/common';
import { AuthTokenManager } from '@domain/auth/managers/auth-token.manager';
import { AuthService } from '@domain/auth/services/auth.service';
import { AuthJwtTokenService } from '@domain/auth/services/auth-jwt-token.service';
import { AuthJwtRefreshTokenModule } from '@infrastructure/module/auth-jwt-refresh-token.module';
import { AuthJwtAccessTokenModule } from '@infrastructure/module/auth-jwt-access-token.module';
import { AuthValidator } from '@domain/auth/validators/auth.validator';
import { UserModule } from '@domain/user/user.module';

@Module({
  imports: [AuthJwtRefreshTokenModule, AuthJwtAccessTokenModule, UserModule],
  providers: [AuthTokenManager, AuthService, AuthJwtTokenService, AuthValidator],
})
export class AuthModule {}
