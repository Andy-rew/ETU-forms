import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';

export class ProcessAdminMySchemasGetViewResponse {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  @TextProperty({ description: 'JSON-схема шаблона для вставки в SurveyJS-компонент' })
  schema: JSON;

  constructor(schema: FormSchemaEntity) {
    this.id = schema.id;
    this.title = schema.title;
    this.schema = schema.schema;
  }
}
