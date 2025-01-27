import { appProcessAdminProcessTag, processAdminBaseController } from '@app/docs/open-api-builds/open-api.build';
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
import { ProcessAdminProcessManagersAddResponse } from '@applications/http/process-admin/process/response/process-admin-process-managers-add.response';
import { ProcessAdminProcessManagersAddDto } from '@applications/http/process-admin/process/request/process-admin-process-managers-add.dto';
import { ProcessAdminProcessManagersRemoveDto } from '@applications/http/process-admin/process/request/process-admin-process-managers-remove.dto';

export function ProcessAdminProcessCompile(): void {
  const processAdminProcessController = processAdminBaseController.createController('/process', [
    appProcessAdminProcessTag,
  ]);

  processAdminProcessController.addApiMethod('/all', {
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

  processAdminProcessController.addApiMethod('/edit', {
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

  processAdminProcessController.addApiMethod('/managers/add', {
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Добавить менеджеров в процесс по списку почт',
    description: 'Если почта не найдена в системе - будет отправлено приглашение как внешнему пользователю',
    requestBody: ProcessAdminProcessManagersAddDto,
    responses: {
      '201': [ProcessAdminProcessManagersAddResponse],
    },
  });

  processAdminProcessController.addApiMethod('/managers/remove', {
    isImplemented: false,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Удалить менеджера из процесса',
    requestBody: ProcessAdminProcessManagersRemoveDto,
    responses: {
      '201': [],
    },
  });
}
