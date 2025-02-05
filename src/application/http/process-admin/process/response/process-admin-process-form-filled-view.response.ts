import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';

export class ProcessAdminProcessFormFilledViewResponse {
  @IdProperty()
  id: number;

  @IdProperty()
  schemaId: number;

  @TextProperty({ description: 'JSON-схема заполненного шаблона для вставки в SurveyJS-компонент' })
  filledSchema: JSON;

  constructor(form: FormSchemaFilledEntity) {
    this.id = form.id;
    this.schemaId = form.schema.id;
    this.filledSchema = form.filledSchema;
  }
}
