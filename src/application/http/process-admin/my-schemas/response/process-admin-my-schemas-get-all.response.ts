import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { DateProperty } from '@applications/decorators/api/common/date.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';
import { CountProperty } from '@applications/decorators/api/common/count.property.decorator';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';

class ProcessAdminGetAllMySchemasSchemaItem {
  @IdProperty({ description: 'Id шаблона для просмотра формы и прикрепления к этапу' })
  formSchemaId: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  @DateProperty()
  createdAt: Date;

  @DateProperty()
  updatedAt: Date;

  constructor(schema: FormSchemaUserTemplateEntity) {
    this.formSchemaId = schema.schema.id;
    this.title = schema.schema.title;
    this.createdAt = schema.createdAt;
    this.updatedAt = schema.updatedAt;
  }
}

export class ProcessAdminMySchemasGetAllResponse {
  @ArraySchemasProperty({
    item: ProcessAdminGetAllMySchemasSchemaItem,
    description: 'Список шаблонов',
  })
  items: ProcessAdminGetAllMySchemasSchemaItem[];

  @CountProperty()
  count: number;

  constructor(count: number, schemas: FormSchemaUserTemplateEntity[]) {
    this.count = count;
    this.items = schemas.map((schema) => new ProcessAdminGetAllMySchemasSchemaItem(schema));
  }
}
