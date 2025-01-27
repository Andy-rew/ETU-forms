import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateProperty } from '@applications/decorators/api/common/date.property.decorator';

export class ProcessAdminMySchemasGetAllDto {
  @EnumApiProperty({ enum: SchemaType, description: 'Тип шаблона для форм' })
  type: SchemaType;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  @DateProperty({ description: 'Дата создания шаблона' })
  createdAt: Date;

  @DateProperty({ description: 'Дата последнего обновления шаблона' })
  updatedAt: Date;
}
