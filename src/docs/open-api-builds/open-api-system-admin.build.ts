import { OpenApiDoc, OpenAPIDocConfig } from '@ivankrtv/openapidoc/dist';
import { apiVersion } from '@app/main';
import * as path from 'path';
import { systemAdminBaseUrl } from '@app/docs/urls/system-admin-urls';

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

export const systemAdminBaseController = openApiDoc.createController(systemAdminBaseUrl);

openApiDoc.addTagGroup('Методы для web-приложения', []);

export const systemAdminDocs = openApiDoc.compileOpenApi();
