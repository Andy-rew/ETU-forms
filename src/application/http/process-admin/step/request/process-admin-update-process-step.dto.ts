import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateWithTimeProperty } from '@applications/decorators/api/common/date-time.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminUpdateProcessStepDto {
  @UuidProperty('Id процесса')
  processId: string;

  @IdProperty({ description: 'Id этапа' })
  stepId: number;

  @TextProperty({ description: 'Название этапа' })
  title: string;

  @DateWithTimeProperty({ description: 'Дата и время начала этапа' })
  startTime: Date;

  @DateWithTimeProperty({ description: 'Дата и время окончания этапа' })
  endTime: Date;

  @TextProperty({
    description: 'Количество участников. Для первого этапа = количеству участников процесса',
    nullable: true,
  })
  participantsCount: number | null;
}
