import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { ArrayPrimitiveProperty } from '@applications/decorators/api/helpers/array-primitive-property.decorator';
import { BoolProperty } from '@ivankrtv/openapidoc/dist';
import { IsBoolean } from 'class-validator';

export class ProcessAdminProcessStepExpertParticipantsDto {
  @UuidProperty()
  processId: string;

  @IdProperty()
  stepId: number;

  @IdProperty({ description: 'Id пользователя эксперта этапа' })
  userExpertId: number;

  @ArrayPrimitiveProperty({
    items: 'number',
    description: 'Список id пользователей участников этапа процесса',
    nullable: true,
  })
  userParticipantsIds: number[] | null;

  @BoolProperty({ description: 'Назначить для эксперта всех участников этапа' })
  @IsBoolean()
  allParticipants: boolean;
}
