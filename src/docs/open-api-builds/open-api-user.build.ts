import type { OpenAPIDocConfig } from '@ivankrtv/openapidoc/dist';
import { OpenApiDoc } from '@ivankrtv/openapidoc/dist';
import { apiVersion } from '@app/main';
import * as path from 'path';
import { userBaseUrl } from '@app/docs/urls/user-urls';

const config: OpenAPIDocConfig = {
  title: 'User ETU-forms',
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

export const clientAppBaseController = openApiDoc.createController(userBaseUrl);

// Теги

openApiDoc.addTagGroup('Методы для приложения', []);

// Импорт всех описанных методов

export const userDocs = openApiDoc.compileOpenApi();
