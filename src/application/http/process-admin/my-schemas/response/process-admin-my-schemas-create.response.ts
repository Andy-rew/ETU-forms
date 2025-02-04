import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';

export class ProcessAdminMySchemasCreateResponse {
  @IdProperty({ description: 'Id шаблона' })
  id: number;

  constructor(schema: FormSchemaEntity) {
    this.id = schema.id;
  }
}
