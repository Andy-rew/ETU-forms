import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ProcessAdminMySchemasCreateResponse {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  constructor(schema: ProcessAdminMySchemasCreateResponse) {
    this.id = schema.id;
  }
}
