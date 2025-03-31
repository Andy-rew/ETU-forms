import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { DateWithTimeProperty } from '@applications/decorators/api/common/date-time.property.decorator';
import { ObjectProperty } from '@ivankrtv/openapidoc/dist';
import { StepEntity } from '@domain/step/entities/step.entity';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';

class ExpertProcessStepFormSchemaItem {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  constructor(schema: FormSchemaEntity) {
    this.id = schema.id;
    this.title = schema.title;
  }
}

class ExpertProcessStepFormAcceptSchemaItem {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  constructor(schema: FormSchemaEntity) {
    this.id = schema.id;
    this.title = schema.title;
  }
}

class ExpertProcessStepFormDeclineSchemaItem {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  constructor(schema: FormSchemaEntity) {
    this.id = schema.id;
    this.title = schema.title;
  }
}

class ExpertProcessStepItem {
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
  formSchema: ExpertProcessStepFormSchemaItem;

  @ObjectProperty({ description: 'Шаблон формы подтверждения' })
  formAcceptSchema: ExpertProcessStepFormAcceptSchemaItem;

  @ObjectProperty({ description: 'Шаблон формы отклонения' })
  formDeclineSchema: ExpertProcessStepFormDeclineSchemaItem;

  constructor(step: StepEntity) {
    this.id = step.id;
    this.title = step.title;
    this.startTime = step.startTime;
    this.endTime = step.endTime;
    this.parentId = step.parent?.id || null;
    this.formSchema = step.formSchema ? new ExpertProcessStepFormSchemaItem(step.formSchema) : null;
    this.formAcceptSchema = step.formAcceptSchema
      ? new ExpertProcessStepFormAcceptSchemaItem(step.formAcceptSchema)
      : null;
    this.formDeclineSchema = step.formDeclineSchema
      ? new ExpertProcessStepFormDeclineSchemaItem(step.formDeclineSchema)
      : null;
  }
}

export class ExpertProcessStepsResponse {
  @ArraySchemasProperty({
    item: ExpertProcessStepItem,
    description: 'Список  моих этапов процесса',
  })
  steps: ExpertProcessStepItem[];

  constructor(steps: StepEntity[]) {
    this.steps = steps.map((step) => new ExpertProcessStepItem(step));
  }
}
