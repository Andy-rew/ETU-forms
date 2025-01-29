import {
  appProcessAdminProcessTag,
  appProcessAdminProcessUsersTag,
  processAdminBaseController,
} from '../open-api-builds/open-api.build';
import { ProcessAdminProcessGetAllDto } from '@applications/http/process-admin/process/request/process-admin-process-get-all.dto';
import { ProcessAdminProcessGetAllResponse } from '@applications/http/process-admin/process/response/process-admin-process-get-all.response';
import { ProcessAdminProcessDeleteDto } from '@applications/http/process-admin/process/request/process-admin-process-delete.dto';
import { ProcessAdminProcessViewDto } from '@applications/http/process-admin/process/request/process-admin-process-view.dto';
import { ProcessAdminProcessViewResponse } from '@applications/http/process-admin/process/response/process-admin-process-view.response';
import { ProcessAdminProcessCreateDto } from '@applications/http/process-admin/process/request/process-admin-process-create.dto';
import { ProcessAdminProcessCreateResponse } from '@applications/http/process-admin/process/response/process-admin-process-create.response';
import { ProcessAdminProcessEditDto } from '@applications/http/process-admin/process/request/process-admin-process-edit.dto';
import { ProcessAdminProcessCreateFromTemplateDto } from '@applications/http/process-admin/process/request/process-admin-process-create-from-template.dto';
import { ProcessAdminProcessCreateFromTemplateResponse } from '@applications/http/process-admin/process/response/process-admin-process-create-from-template.response';
import { ProcessAdminProcessUsersAddResponse } from '@applications/http/process-admin/process/response/process-admin-process-users-add.response';
import { ProcessAdminProcessUsersAddDto } from '@applications/http/process-admin/process/request/process-admin-process-users-add.dto';
import { ProcessAdminProcessUsersRemoveDto } from '@applications/http/process-admin/process/request/process-admin-process-users-remove.dto';
import { ProcessAdminProcessUsersGetAllDto } from '@applications/http/process-admin/process/request/process-admin-process-users-get-all.dto';
import { ProcessAdminProcessUsersGetAllResponse } from '@applications/http/process-admin/process/response/process-admin-process-users-get-all.response';

export function ProcessAdminProcessCompile(): void {
  const processAdminProcessController = processAdminBaseController.createController('/process', [,]);

  processAdminProcessController.addApiMethod('/all', {
    tags: [appProcessAdminProcessTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить все процессы',
    query: ProcessAdminProcessGetAllDto,
    responses: {
      '200': [ProcessAdminProcessGetAllResponse],
    },
  });

  processAdminProcessController.addApiMethod('/delete', {
    tags: [appProcessAdminProcessTag],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Удалить процесс',
    description: 'Мягкое удаление процесса',
    requestBody: ProcessAdminProcessDeleteDto,
    responses: {
      '201': [],
    },
  });

  processAdminProcessController.addApiMethod('/view', {
    tags: [appProcessAdminProcessTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить основную информацию о процессе',
    requestBody: ProcessAdminProcessViewDto,
    responses: {
      '200': [ProcessAdminProcessViewResponse],
    },
  });

  processAdminProcessController.addApiMethod('/create', {
    tags: [appProcessAdminProcessTag],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Создать процесс с основной информацией',
    requestBody: ProcessAdminProcessCreateDto,
    responses: {
      '201': [ProcessAdminProcessCreateResponse],
    },
  });

  processAdminProcessController.addApiMethod('/create/from-template', {
    tags: [appProcessAdminProcessTag],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Создать процесс с основной информацией по шаблону',
    description: 'Будут скопированы этапы и прикрепленные к ним шаблоны форм',
    requestBody: ProcessAdminProcessCreateFromTemplateDto,
    responses: {
      '201': [ProcessAdminProcessCreateFromTemplateResponse],
    },
  });

  processAdminProcessController.addApiMethod('/users/add', {
    tags: [appProcessAdminProcessUsersTag],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Добавить пользователя в процесс по списку почт',
    description: 'Если почта не найдена в системе - будет отправлено приглашение как внешнему пользователю',
    requestBody: ProcessAdminProcessUsersAddDto,
    responses: {
      '201': [ProcessAdminProcessUsersAddResponse],
    },
  });

  processAdminProcessController.addApiMethod('/users/remove', {
    tags: [appProcessAdminProcessUsersTag],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Удалить пользователя из процесса',
    requestBody: ProcessAdminProcessUsersRemoveDto,
    responses: {
      '201': [],
    },
  });

  processAdminProcessController.addApiMethod('/users/all', {
    tags: [appProcessAdminProcessUsersTag],
    isImplemented: false,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить актуальный список пользователей процесса',
    query: ProcessAdminProcessUsersGetAllDto,
    responses: {
      '200': [ProcessAdminProcessUsersGetAllResponse],
    },
  });

  processAdminProcessController.addApiMethod('/edit', {
    tags: [appProcessAdminProcessTag],
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Редактировать основную информацию о процессе',
    description: 'Если поле не изменилось - все равно отправить его',
    requestBody: ProcessAdminProcessEditDto,
    responses: {
      '201': [],
    },
  });
}
