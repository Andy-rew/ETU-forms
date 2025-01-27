import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { EnumProperty } from '@ivankrtv/openapidoc/dist';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';

export class ProcessAdminMySchemasCreateDto {
  @EnumProperty({ enum: SchemaType })
  type: SchemaType;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  @TextProperty({
    description: 'JSON-схема шаблона для вставки в SurveyJS-компонент',
  })
  schema: JSON;
}
