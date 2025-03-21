import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { SurveySchemaType } from '@domain/form-schema/type/survey-schema.type';

export class ProcessAdminProcessFormTemplateViewResponse {
  @IdProperty()
  id: number;

  @TextProperty({ description: 'JSON-схема шаблона для вставки в SurveyJS-компонент' })
  schema: SurveySchemaType;

  constructor(formSchema: FormSchemaEntity) {
    this.id = formSchema.id;
    this.schema = formSchema.schema;
  }
}
