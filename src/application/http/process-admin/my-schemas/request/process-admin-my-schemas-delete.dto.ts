import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ProcessAdminMySchemasDeleteDto {
  @IdProperty()
  schemaId: number;
}
