import { OpenApiDoc, OpenAPIDocConfig } from '@ivankrtv/openapidoc/dist';
import { apiVersion } from '@app/main';
import * as path from 'path';
import { SystemAdminUserCompile } from '@app/docs/system-admin/system-admin-user.compile';
import { AuthCompile } from '@app/docs/common/auth.compile';
import { ProcessAdminProcessCompile } from '@app/docs/process-admin/process-admin-process.compile';
import { ProcessAdminMySchemasCompile } from '@app/docs/process-admin/process-admin-my-schemas.compile';

const config: OpenAPIDocConfig = {
  title: 'api ETU-forms',
  version: apiVersion,
  additionalDescription: path.resolve(`${__dirname}/Doc.md`),
};

const openApiDoc = new OpenApiDoc(config);

openApiDoc.setAuthorization({
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
  },
});

export const systemAdminBaseController = openApiDoc.createController('/system-admin');
export const processAdminBaseController = openApiDoc.createController('/process-admin');
export const userBaseController = openApiDoc.createController('/user');
export const authBaseController = openApiDoc.createController('/auth');

export const appSystemAdminUsersTag = openApiDoc.createTag('Пользователи');
export const appSystemAdminProcessTag = openApiDoc.createTag('Процессы');

export const appProcessAdminProcessTag = openApiDoc.createTag('Процессы');
export const appProcessAdminMySchemasTag = openApiDoc.createTag('Мои шаблоны форм');

export const authTag = openApiDoc.createTag('Общее');

openApiDoc.addTagGroup('Регистрация и авторизация', [authTag]);

openApiDoc.addTagGroup('Админ системы', [appSystemAdminUsersTag, appSystemAdminProcessTag]);

openApiDoc.addTagGroup('Админ процессов', [appProcessAdminProcessTag, appProcessAdminMySchemasTag]);

openApiDoc.addTagGroup('Пользователь', []);

AuthCompile();

SystemAdminUserCompile();

ProcessAdminProcessCompile();
ProcessAdminMySchemasCompile();

export const systemAdminDocs = openApiDoc.compileOpenApi();
