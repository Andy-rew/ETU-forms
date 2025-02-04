import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateWithTimeProperty } from '@applications/decorators/api/common/date-time.property.decorator';

export class ProcessAdminCreateProcessStepDto {
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

  @IdProperty({ description: 'Id родительского этапа (после которого данный). Для первого = null', nullable: true })
  parentId: number | null;
}
