import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { EnumProperty, StringProperty } from '@ivankrtv/openapidoc/dist';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { ValidateSurveySchema } from '@applications/decorators/api/common/validate-survey-schema.property.decorator';
import { SurveySchemaType } from '@domain/form-schema/type/survey-schema.type';

export class ProcessAdminMySchemasCreateDto {
  @EnumProperty({ enum: SchemaType })
  type: SchemaType;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  @StringProperty({ description: 'JSON-схема шаблона для вставки в SurveyJS-компонент', example: '' })
  @ValidateSurveySchema()
  schema: SurveySchemaType;
}
