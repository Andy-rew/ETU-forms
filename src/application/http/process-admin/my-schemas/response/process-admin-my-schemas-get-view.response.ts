import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';

export class ProcessAdminMySchemasGetViewResponse {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  @TextProperty({ description: 'JSON-схема шаблона для вставки в SurveyJS-компонент' })
  schema: JSON;

  constructor(schema: FormSchemaUserTemplateEntity) {
    this.id = schema.id;
    this.schema = schema.schema.schema;
  }
}
