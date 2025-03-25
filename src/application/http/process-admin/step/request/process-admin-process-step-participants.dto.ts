import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { LimitProperty } from '@applications/decorators/api/common/limit.property.decorator';
import { OffsetProperty } from '@applications/decorators/api/common/offset.property.decorator';

export class ProcessAdminProcessStepParticipantsDto {
  @IdProperty({ description: 'Id этапа' })
  stepId: number;

  @UuidProperty()
  processId: string;

  @LimitProperty()
  limit: number;

  @OffsetProperty()
  offset: number;

  @TextProperty({ description: 'Фильтр по имени', example: 'Иван', isOptional: true })
  nameFilter?: string;

  @TextProperty({ description: 'Фильтр по фамилии', example: 'Иванов', isOptional: true })
  surnameFilter?: string;

  @TextProperty({ description: 'Фильтр по отчеству', example: 'Иванович', isOptional: true })
  patronymicFilter?: string;

  @TextProperty({ description: 'Фильтр по email', example: 'email@example.com', isOptional: true })
  emailFilter?: string;
}
