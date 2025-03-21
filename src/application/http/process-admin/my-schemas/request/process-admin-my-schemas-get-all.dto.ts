import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateProperty } from '@applications/decorators/api/common/date.property.decorator';
import { LimitProperty } from '@applications/decorators/api/common/limit.property.decorator';
import { OffsetProperty } from '@applications/decorators/api/common/offset.property.decorator';

export class ProcessAdminMySchemasGetAllDto {
  @EnumApiProperty({ enum: SchemaType, description: 'Тип шаблона для форм' })
  type: SchemaType;

  @LimitProperty()
  limit: number;

  @OffsetProperty()
  offset: number;

  @TextProperty({ description: 'Название шаблона', isOptional: true })
  title?: string;

  @DateProperty({ description: 'Дата создания шаблона', isOptional: true })
  createdAt?: Date;

  @DateProperty({ description: 'Дата последнего обновления шаблона', isOptional: true })
  updatedAt?: Date;
}
