import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';

export class UserProcessStepApplyDto {
  @UuidProperty('Id процесса')
  processId: string;

  @IdProperty()
  stepId: number;

  @IdProperty({ description: 'Id шаблона формы этапа' })
  formSchemaId: number;

  @TextProperty({ description: 'Заполненная форма этапа' })
  filledForm: JSON;
}
