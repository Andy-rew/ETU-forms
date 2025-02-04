import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateWithTimeProperty } from '@applications/decorators/api/common/date-time.property.decorator';
import { StepEntity } from '@domain/step/entities/step.entity';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { ObjectProperty } from '@ivankrtv/openapidoc/dist';

class ProcessAdminViewProcessStepAcceptSchema {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  constructor(schema: FormSchemaEntity) {
    this.id = schema.id;
    this.title = schema.title;
  }
}

class ProcessAdminViewProcessStepDeclineSchema {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  constructor(schema: FormSchemaEntity) {
    this.id = schema.id;
    this.title = schema.title;
  }
}

class ProcessAdminViewProcessStepSchema {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  constructor(schema: FormSchemaEntity) {
    this.id = schema.id;
    this.title = schema.title;
  }
}

export class ProcessAdminViewProcessStepResponse {
  @IdProperty({ description: 'Id этапа' })
  id: number;

  @TextProperty({ description: 'Название этапа' })
  title: string;

  @DateWithTimeProperty({ description: 'Дата и время начала этапа' })
  startTime: Date;

  @DateWithTimeProperty({ description: 'Дата и время окончания этапа' })
  endTime: Date;

  @TextProperty({ description: 'Количество участников. Для первого этапа = количеству участников процесса' })
  participantsCount: number;

  @IdProperty({ description: 'Id родительского этапа (после которого данный). Для первого = null', nullable: true })
  parentId: number | null;

  @ObjectProperty({ description: 'Шаблон подтверждения', nullable: true })
  formAcceptSchema: ProcessAdminViewProcessStepAcceptSchema | null;

  @ObjectProperty({ description: 'Шаблон формы отклонения', nullable: true })
  formDeclineSchema: ProcessAdminViewProcessStepDeclineSchema | null;

  @ObjectProperty({ description: 'Шаблон формы этапа', nullable: true })
  formSchema: ProcessAdminViewProcessStepSchema | null;

  constructor(step: StepEntity) {
    this.id = step.id;
    this.title = step.title;
    this.startTime = step.startTime;
    this.endTime = step.endTime;
    this.participantsCount = step.participantsCount;
    this.parentId = step.parent?.id || null;
    this.formAcceptSchema = step.formAcceptSchema
      ? new ProcessAdminViewProcessStepAcceptSchema(step.formAcceptSchema)
      : null;
    this.formDeclineSchema = step.formDeclineSchema
      ? new ProcessAdminViewProcessStepDeclineSchema(step.formDeclineSchema)
      : null;
    this.formSchema = step.formSchema ? new ProcessAdminViewProcessStepSchema(step.formSchema) : null;
  }
}
