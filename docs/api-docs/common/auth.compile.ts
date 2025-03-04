import { authBaseController, authTag } from '../open-api-builds/open-api.build';
import { AuthSignUpResponse } from '@applications/http/common/auth/response/auth-sign-up.response';
import { AuthSignUpDto } from '@applications/http/common/auth/request/auth-sign-up.dto';
import { AuthSignInDto } from '@applications/http/common/auth/request/auth-sign-in.dto';
import { AuthSignInResponse } from '@applications/http/common/auth/response/auth-sign-in.response';
import { AuthRefreshDto } from '@applications/http/common/auth/request/auth-refresh.dto';
import { AuthRefreshResponse } from '@applications/http/common/auth/response/auth-refresh.response';

export function AuthCompile(): void {
  const authController = authBaseController.createController('', [authTag]);

  authController.addApiMethod('/sign-up', {
    isImplemented: true,
    method: 'POST',
    requiresAuthorization: false,
    title: 'Зарегистрироваться в системе',
    requestBody: AuthSignUpDto,
    responses: {
      '201': [AuthSignUpResponse],
    },
  });

  authController.addApiMethod('/sign-in', {
    isImplemented: true,
    method: 'POST',
    requiresAuthorization: false,
    title: 'Авторизоваться в системе по связке логин-пароль',
    requestBody: AuthSignInDto,
    responses: {
      '201': [AuthSignInResponse],
    },
  });

  authController.addApiMethod('/sign-out', {
    isImplemented: true,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Выход из системы',
    description: 'Выход из системы. Удаляется пара access-токен/refresh-токен',
    responses: {
      '201': [],
    },
  });

  authController.addApiMethod('/refresh', {
    isImplemented: true,
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
