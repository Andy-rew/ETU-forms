import { OpenApiDoc, OpenAPIDocConfig } from '@ivankrtv/openapidoc/dist';
import { apiVersion } from '@app/main';
import * as path from 'path';
import { processAdminBaseUrl } from '@app/docs/urls/process-admin-urls';

const config: OpenAPIDocConfig = {
  title: 'Process admin ETU-forms',
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

export const processAdminBaseController = openApiDoc.createController(processAdminBaseUrl);

openApiDoc.addTagGroup('Методы для web-приложения', []);

export const processAdminDocs = openApiDoc.compileOpenApi();
