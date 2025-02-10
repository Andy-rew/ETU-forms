import { OpenApiDoc, OpenAPIDocConfig } from '@ivankrtv/openapidoc/dist';
import { apiVersion } from '@app/main';
import * as path from 'path';
import { SystemAdminUserCompile } from '../system-admin/system-admin-user.compile';
import { AuthCompile } from '../common/auth.compile';
import { ProcessAdminProcessCompile } from '../process-admin/process-admin-process.compile';
import { ProcessAdminMySchemasCompile } from '../process-admin/process-admin-my-schemas.compile';
import { ProcessAdminUsersCompile } from '../process-admin/process-admin-user.compile';
import { ProcessAdminStepCompile } from '../process-admin/process-admin-step.compile';
import { ProcessCompile } from '../common/process.compile';
import { UserProcessCompile } from '../user/user-process.compile';

const config: OpenAPIDocConfig = {
  title: 'api ETU-forms',
  version: apiVersion,
  additionalDescription: path.resolve(`${__dirname}/../../Doc.md`),
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
export const processBaseController = openApiDoc.createController('/process');

export const appSystemAdminUsersTag = openApiDoc.createTag('Пользователи (Адм-сис.)');

export const appProcessAdminProcessTag = openApiDoc.createTag('Процессы. Общее (Адм.)');
export const appProcessAdminProcessUsersTag = openApiDoc.createTag('Процессы. Пользователи');
export const appProcessAdminMySchemasTag = openApiDoc.createTag('Мои шаблоны форм');
export const appProcessAdminUsersTag = openApiDoc.createTag('Пользователи');
export const appProcessAdminStepsTag = openApiDoc.createTag('Этапы процесса');

export const appUserManagerProcessTag = openApiDoc.createTag('Процессы. Общее (Мен.)');

export const appUserProcessTag = openApiDoc.createTag('Процессы.(Уч.)');

export const authTag = openApiDoc.createTag('Регистрация и авторизация');
export const processTag = openApiDoc.createTag('Процессы');

openApiDoc.addTagGroup('Общее', [authTag, processTag]);

openApiDoc.addTagGroup('Админ системы', [appSystemAdminUsersTag]);

openApiDoc.addTagGroup('Админ процессов', [
  appProcessAdminMySchemasTag,
  appProcessAdminProcessTag,
  appProcessAdminProcessUsersTag,
  appProcessAdminUsersTag,
  appProcessAdminStepsTag,
]);

openApiDoc.addTagGroup('Пользователь.Менеджер процесса', [
  appUserManagerProcessTag,
  appProcessAdminStepsTag,
  appProcessAdminUsersTag,
  appProcessAdminProcessUsersTag,
]);

openApiDoc.addTagGroup('Пользователь. Участник процесса', [appUserProcessTag]);

AuthCompile();
ProcessCompile();

SystemAdminUserCompile();

ProcessAdminProcessCompile();
ProcessAdminMySchemasCompile();
ProcessAdminUsersCompile();
ProcessAdminStepCompile();

UserProcessCompile();

export const systemAdminDocs = openApiDoc.compileOpenApi();
