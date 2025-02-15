import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';

export class UserProcessStepReactionSchemaFilledResponse {
  @IdProperty({ description: 'Id заполненной формы реакции' })
  id: number;

  @TextProperty({ description: 'JSON-схема формы реакции для вставки в SurveyJS-компонент' })
  reactionFilledForm: JSON;

  constructor(form: FormSchemaFilledEntity) {
    this.id = form.id;
    this.reactionFilledForm = form.filledSchema;
  }
}
