import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { EnumProperty, StringProperty } from '@ivankrtv/openapidoc/dist';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { SurveySchemaProperty } from '@applications/decorators/api/common/survey-schema.property.decorator';

export class ProcessAdminMySchemasCreateDto {
  @EnumProperty({ enum: SchemaType })
  type: SchemaType;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  // TODO: add validation
  @StringProperty({ description: 'JSON-схема шаблона для вставки в SurveyJS-компонент', example: '' })
  @SurveySchemaProperty()
  schema: any;
}
