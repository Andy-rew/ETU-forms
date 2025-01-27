import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ProcessAdminProcessCreateFromTemplateDto {
  @IdProperty({ description: 'id старого процесса' })
  id: number;
}
