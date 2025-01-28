import { appSystemAdminUsersTag, systemAdminBaseController } from '../open-api-builds/open-api.build';
import { SystemAdminUserInviteDto } from '@applications/http/system-admin/user/request/system-admin-user-invite.dto';
import { SystemAdminUserInviteResponse } from '@applications/http/system-admin/user/response/system-admin-user-invite.response';
import { SystemAdminUserDeleteDto } from '@applications/http/system-admin/user/request/system-admin-user-delete.dto';

export function SystemAdminUserCompile(): void {
  const systemAdminUserController = systemAdminBaseController.createController('/user', [appSystemAdminUsersTag]);

  systemAdminUserController.addApiMethod('/invite', {
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Пригласить пользователя в систему',
    requestBody: SystemAdminUserInviteDto,
    responses: {
      '201': [SystemAdminUserInviteResponse],
    },
  });

  systemAdminUserController.addApiMethod('/delete', {
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Удалить пользователя из системы',
    requestBody: SystemAdminUserDeleteDto,
    responses: {
      '201': [],
    },
  });
}
