import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';

export class UserProcessStepFormFilledResponse {
  @IdProperty({ description: 'Id заполненной формы этапа' })
  id: number;

  @TextProperty({ description: 'JSON-схема заполненной формы этапа для вставки в SurveyJS-компонент' })
  filledForm: JSON;

  constructor(filledForm: FormSchemaFilledEntity) {
    this.id = filledForm.id;
    this.filledForm = filledForm.filledSchema;
  }
}
