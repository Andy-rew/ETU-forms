import { StepEntity } from '@domain/step/entities/step.entity';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateWithTimeProperty } from '@applications/decorators/api/common/date-time.property.decorator';

class ProcessAdminGetAllProcessStepItem {
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

  @DateWithTimeProperty()
  createdAt: Date;

  constructor(step: StepEntity) {
    this.id = step.id;
    this.title = step.title;
    this.startTime = step.startTime;
    this.endTime = step.endTime;
    this.participantsCount = step.participantsCount;
    this.parentId = step.parent?.id || null;
    this.createdAt = step.createdAt;
  }
}

export class ProcessAdminGetAllProcessStepsResponse {
  @ArraySchemasProperty({ description: 'Список этапов', item: ProcessAdminGetAllProcessStepItem })
  steps: ProcessAdminGetAllProcessStepItem[];

  constructor(steps: StepEntity[]) {
    this.steps = steps.map((step) => new ProcessAdminGetAllProcessStepItem(step));
  }
}
