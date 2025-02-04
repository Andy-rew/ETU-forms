import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateWithTimeProperty } from '@applications/decorators/api/common/date-time.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminUpdateProcessStepDto {
  @UuidProperty('Id процесса')
  processId: string;

  @IdProperty({ description: 'Id этапа' })
  id: number;

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

  @IdProperty({ description: 'Id шаблона подтверждения', nullable: true })
  acceptFormId: number | null;

  @IdProperty({ description: 'Id шаблона отклонения', nullable: true })
  declineFormId: number | null;

  @IdProperty({ description: 'Id шаблона этапа', nullable: true })
  formId: number | null;
}
