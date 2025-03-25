import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { BoolProperty } from '@ivankrtv/openapidoc/dist';
import { IsBoolean } from 'class-validator';

export class ProcessAdminProcessStepExpertMainDto {
  @IdProperty({ description: 'Id пользователя, для назначения/снятия главного эксперта' })
  userId: number;

  @IdProperty({ description: 'Id этапа' })
  stepId: number;

  @UuidProperty()
  processId: string;

  @BoolProperty({ description: 'Флаг главного эксперта' })
  @IsBoolean()
  isMain: boolean;
}
