import { OpenApiDoc, OpenAPIDocConfig } from '@ivankrtv/openapidoc/dist';
import { apiVersion } from '@app/main';
import * as path from 'path';
import { SystemAdminUserCompile } from '@app/docs/system-admin/system-admin-user.compile';
import { AuthCompile } from '@app/docs/common/auth.compile';

const config: OpenAPIDocConfig = {
  title: 'System admin ETU-forms',
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

export const authTag = openApiDoc.createTag('Общее');

openApiDoc.addTagGroup('Регистрация и авторизация', [authTag]);

openApiDoc.addTagGroup('Админ системы', [appSystemAdminUsersTag, appSystemAdminProcessTag]);

openApiDoc.addTagGroup('Админ процессов', [appProcessAdminProcessTag]);

openApiDoc.addTagGroup('Пользователь', []);

AuthCompile();

SystemAdminUserCompile();

export const systemAdminDocs = openApiDoc.compileOpenApi();
