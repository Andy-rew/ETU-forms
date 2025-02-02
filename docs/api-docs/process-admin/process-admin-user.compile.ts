import { appProcessAdminUsersTag, processAdminBaseController } from '../open-api-builds/open-api.build';
import { ProcessAdminUsersWorkersDto } from '@applications/http/process-admin/user/request/process-admin-users-workers.dto';
import { ProcessAdminUsersStudentsDto } from '@applications/http/process-admin/user/request/process-admin-users-students.dto';
import { ProcessAdminUsersWorkersResponse } from '@applications/http/process-admin/user/response/process-admin-users-workers.response';
import { ProcessAdminUsersStudentsResponse } from '@applications/http/process-admin/user/response/process-admin-users-students.response';
import { ProcessAdminUsersInviteDto } from '@applications/http/process-admin/user/request/process-admin-users-invite.dto';

export function ProcessAdminUsersCompile(): void {
  const processAdminUserController = processAdminBaseController.createController('/users', []);

  processAdminUserController.addApiMethod('/workers', {
    tags: [appProcessAdminUsersTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить всех сотрудников ЛЭТИ для добавления в процесс',
    query: ProcessAdminUsersWorkersDto,
    responses: {
      '200': [ProcessAdminUsersWorkersResponse],
    },
  });

  processAdminUserController.addApiMethod('/students', {
    tags: [appProcessAdminUsersTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить всех студентов ЛЭТИ для добавления в процесс',
    query: ProcessAdminUsersStudentsDto,
    responses: {
      '200': [ProcessAdminUsersStudentsResponse],
    },
  });

  processAdminUserController.addApiMethod('/invite', {
    tags: [appProcessAdminUsersTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Отправить(или отправить повторно) приглашение пользователю',
    description: 'Отправка приглашения пользователю по email для участия в процессе',
    requestBody: ProcessAdminUsersInviteDto,
    responses: {
      '201': [],
    },
  });
}
