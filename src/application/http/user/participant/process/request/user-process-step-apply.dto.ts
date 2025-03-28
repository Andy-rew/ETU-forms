import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { StringProperty } from '@ivankrtv/openapidoc/dist';

export class UserProcessStepApplyDto {
  @UuidProperty('Id процесса')
  processId: string;

  @IdProperty()
  stepId: number;

  @IdProperty({ description: 'Id шаблона формы этапа' })
  formSchemaId: number;

  @StringProperty({ description: 'JSON результат заполненной формы', example: '' })
  filledForm: JSON;
}
