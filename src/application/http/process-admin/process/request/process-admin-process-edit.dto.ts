import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateProperty } from '@applications/decorators/api/common/date.property.decorator';
import { ArrayPrimitiveProperty } from '@applications/decorators/api/helpers/array-primitive-property.decorator';

export class ProcessAdminProcessEditDto {
  @UuidProperty()
  processId: string;

  @TextProperty({ description: 'Название процесса' })
  title: string;

  @DateProperty({ description: 'Дата начала процесса' })
  startDate: Date;

  @DateProperty({ description: 'Дата окончания процесса' })
  endDate: Date;

  @ArrayPrimitiveProperty({
    items: 'number',
    description: 'Список id предварительно загруженных изображений процесса',
    nullable: true,
  })
  imageIds: number[] | null;

  @TextProperty({ description: 'Описание процесса', nullable: true })
  description: string | null;
}
