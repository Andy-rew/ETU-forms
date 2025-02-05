import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ProcessAdminProcessStepParticipantFormDto {
  @IdProperty({ description: 'id участника процесса' })
  id: number;
}
