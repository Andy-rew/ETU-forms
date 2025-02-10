import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { StepEntity } from '@domain/step/entities/step.entity';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { DateWithTimeProperty } from '@applications/decorators/api/common/date-time.property.decorator';
import { ObjectProperty } from '@ivankrtv/openapidoc/dist';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';

class UserProcessMyStepsStepFormSchemaItem {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  constructor(schema: FormSchemaEntity) {
    this.id = schema.id;
    this.title = schema.title;
  }
}

class UserProcessMyStepsStepItem {
  @IdProperty({ description: 'Id этапа' })
  id: number;

  @TextProperty({ description: 'Название этапа' })
  title: string;

  @DateWithTimeProperty({ description: 'Дата и время начала этапа' })
  startTime: Date;

  @DateWithTimeProperty({ description: 'Дата и время окончания этапа' })
  endTime: Date;

  @IdProperty({ description: 'Id родительского этапа (после которого данный). Для первого = null', nullable: true })
  parentId: number | null;

  @ObjectProperty({ description: 'Шаблон формы этапа' })
  formSchema: UserProcessMyStepsStepFormSchemaItem;

  constructor(step: StepEntity) {
    this.id = step.id;
    this.title = step.title;
    this.startTime = step.startTime;
    this.endTime = step.endTime;
    this.parentId = step.parent?.id || null;
    this.formSchema = new UserProcessMyStepsStepFormSchemaItem(step.formSchema);
  }
}

export class UserProcessMyStepsResponse {
  @ArraySchemasProperty({
    item: UserProcessMyStepsStepItem,
    description: 'Список  моих этапов процесса',
  })
  steps: UserProcessMyStepsStepItem[];

  constructor(steps: StepEntity[]) {
    this.steps = steps.map((step) => new UserProcessMyStepsStepItem(step));
  }
}
