import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ProcessAdminMySchemasGetViewDto {
  @IdProperty({ description: 'Id шаблона' })
  schemaId: number;
}
