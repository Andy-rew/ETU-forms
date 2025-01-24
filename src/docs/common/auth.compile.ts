import { authBaseController, authTag } from '@app/docs/open-api-builds/open-api.build';
import { AuthSignUpResponse } from '@applications/http/common/auth/response/auth-sign-up.response';
import { AuthSignUpDto } from '@applications/http/common/auth/request/auth-sign-up.dto';
import { AuthSignInDto } from '@applications/http/common/auth/request/auth-sign-in.dto';
import { AuthSignInResponse } from '@applications/http/common/auth/response/auth-sign-in.response';
import { AuthRefreshDto } from '@applications/http/common/auth/request/auth-refresh.dto';
import { AuthRefreshResponse } from '@applications/http/common/auth/response/auth-refresh.response';

export function AuthCompile(): void {
  const authController = authBaseController.createController('', [authTag]);

  authController.addApiMethod('/sign-up', {
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: false,
    title: 'Зарегистрироваться в системе',
    requestBody: AuthSignUpDto,
    responses: {
      '201': [AuthSignUpResponse],
    },
  });

  authController.addApiMethod('/sign-in', {
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: false,
    title: 'Авторизоваться в системе по связке логин-пароль',
    requestBody: AuthSignInDto,
    responses: {
      '201': [AuthSignInResponse],
    },
  });

  authController.addApiMethod('/refresh', {
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Обновить access токен по refresh токену',
    description: 'Обновить access токен по refresh токену (если истек, то только по /sign-in)',
    requestBody: AuthRefreshDto,
    responses: {
      '201': [AuthRefreshResponse],
    },
  });
}
