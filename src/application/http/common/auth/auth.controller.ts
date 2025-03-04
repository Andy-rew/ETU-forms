import { Body, Controller, Post } from '@nestjs/common';
import { AuthRoles } from '@applications/decorators/auth-roles.decorator';
import { AuthService } from '@domain/auth/services/auth.service';
import { AuthSignUpDto } from '@applications/http/common/auth/request/auth-sign-up.dto';
import { AuthSignInDto } from '@applications/http/common/auth/request/auth-sign-in.dto';
import { AuthRefreshDto } from '@applications/http/common/auth/request/auth-refresh.dto';
import { AuthSignInResponse } from '@applications/http/common/auth/response/auth-sign-in.response';
import { AuthSignUpResponse } from '@applications/http/common/auth/response/auth-sign-up.response';
import { ReqToken } from '@applications/decorators/req-token.decorator';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { AuthRefreshResponse } from '@applications/http/common/auth/response/auth-refresh.response';
import { ReqUser } from '@applications/decorators/req-user.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() body: AuthSignInDto) {
    const res = await this.authService.signIn({ email: body.email, password: body.password });
    return new AuthSignInResponse(res);
  }

  @Post('/sign-up')
  async signUp(@Body() body: AuthSignUpDto) {
    const res = await this.authService.signUpByActivationCode({
      activationCode: body.activationToken,
      password: body.password,
      samePassword: body.samePassword,
    });
    return new AuthSignUpResponse(res.user);
  }

  @AuthRoles()
  @Post('/sign-out')
  async signOut(@ReqToken() token: UserAuthTokensEntity) {
    await this.authService.signOut({ accessToken: token.accessToken, userId: token.user.id });
  }

  @AuthRoles()
  @Post('/refresh')
  async refresh(@Body() body: AuthRefreshDto, @ReqUser() user: UserEntity) {
    const res = await this.authService.refreshTokens({ refreshToken: body.refreshToken, currentUser: user });
    return new AuthRefreshResponse(res);
  }
}
