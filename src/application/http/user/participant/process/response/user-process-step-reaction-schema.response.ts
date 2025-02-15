import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';

export class UserProcessStepReactionSchemaResponse {
  @IdProperty({ description: 'Id шаблона формы реакции' })
  id: number;

  @TextProperty({ description: 'JSON-схема шаблона формы реакции для вставки в SurveyJS-компонент' })
  reactionSchema: JSON;

  constructor(formSchema: FormSchemaEntity) {
    this.id = formSchema.id;
    this.reactionSchema = formSchema.schema;
  }
}
