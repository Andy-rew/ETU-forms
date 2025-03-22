import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { SurveySchemaType } from '@domain/form-schema/type/survey-schema.type';
import { ValidateSurveySchema } from '@applications/decorators/api/common/validate-survey-schema.property.decorator';
import { StringProperty } from '@ivankrtv/openapidoc/dist';

export class ProcessAdminMySchemasEditDto {
  @IdProperty()
  schemaId: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  @StringProperty({ description: 'JSON-схема шаблона для вставки в SurveyJS-компонент', example: '' })
  @ValidateSurveySchema()
  schema: SurveySchemaType;
}
