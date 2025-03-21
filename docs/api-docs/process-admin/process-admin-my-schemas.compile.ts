import { appProcessAdminMySchemasTag, processAdminBaseController } from '../open-api-builds/open-api.build';
import { ProcessAdminMySchemasGetAllDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-get-all.dto';
import { ProcessAdminMySchemasGetAllResponse } from '@applications/http/process-admin/my-schemas/response/process-admin-my-schemas-get-all.response';
import { ProcessAdminMySchemasGetViewDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-get-view.dto';
import { ProcessAdminMySchemasGetViewResponse } from '@applications/http/process-admin/my-schemas/response/process-admin-my-schemas-get-view.response';
import { ProcessAdminMySchemasDeleteDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-delete.dto';
import { ProcessAdminMySchemasCreateDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-create.dto';
import { ProcessAdminMySchemasCreateResponse } from '@applications/http/process-admin/my-schemas/response/process-admin-my-schemas-create.response';
import { ProcessAdminMySchemasEditDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-edit.dto';

export function ProcessAdminMySchemasCompile(): void {
  const processAdminMySchemasController = processAdminBaseController.createController('/my-schemas', [
    appProcessAdminMySchemasTag,
  ]);

  processAdminMySchemasController.addApiMethod('/all', {
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить все мои шаблоны форм',
    query: ProcessAdminMySchemasGetAllDto,
    responses: {
      '200': [ProcessAdminMySchemasGetAllResponse],
    },
  });

  processAdminMySchemasController.addApiMethod('/view', {
    isImplemented: true,
    method: 'GET',
    requiresAuthorization: true,
    title: 'Получить шаблон формы',
    query: ProcessAdminMySchemasGetViewDto,
    responses: {
      '200': [ProcessAdminMySchemasGetViewResponse],
    },
  });

  processAdminMySchemasController.addApiMethod('/delete', {
    isImplemented: true,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Удалить шаблон формы',
    requestBody: ProcessAdminMySchemasDeleteDto,
    responses: {
      '201': [],
    },
  });

  processAdminMySchemasController.addApiMethod('/create', {
    isImplemented: true,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Создать шаблон формы',
    requestBody: ProcessAdminMySchemasCreateDto,
    responses: {
      '201': [ProcessAdminMySchemasCreateResponse],
    },
  });

  processAdminMySchemasController.addApiMethod('/edit', {
    isImplemented: true,
    method: 'POST',
    requiresAuthorization: true,
    title: 'Редактировать шаблон формы',
    description: 'Если поле не изменилось - все равно отправить его',
    requestBody: ProcessAdminMySchemasEditDto,
    responses: {
      '201': [],
    },
  });
}
