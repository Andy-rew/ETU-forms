import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

export class ProcessAdminMySchemasEditDto {
  @IdProperty()
  id: number;

  @TextProperty({ description: 'Название шаблона' })
  title: string;

  @TextProperty({
    description: 'JSON-схема шаблона для вставки в SurveyJS-компонент',
  })
  schema: JSON;
}
