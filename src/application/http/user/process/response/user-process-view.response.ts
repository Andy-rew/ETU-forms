import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { FileEntity } from '@domain/file/entities/file.entity';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { DateProperty } from '@applications/decorators/api/common/date.property.decorator';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { ProcessEntity } from '@domain/process/entities/process.entity';

class UserProcessViewImageItem {
  @IdProperty()
  id: number;

  @TextProperty({ description: 'URL изображения' })
  url: string;

  constructor(image: FileEntity) {
    this.id = image.id;
    this.url = image.url;
  }
}

export class UserProcessViewResponse {
  @UuidProperty()
  id: string;

  @TextProperty({ description: 'Название процесса' })
  title: string;

  @DateProperty({ description: 'Дата начала процесса' })
  startDate: Date;

  @DateProperty({ description: 'Дата окончания процесса' })
  endDate: Date;

  @ArraySchemasProperty({
    item: UserProcessViewImageItem,
    description: 'Список URL изображений процесса',
  })
  imageUrls: UserProcessViewImageItem[];

  @TextProperty({ description: 'Описание процесса', nullable: true })
  description: string | null;

  constructor(process: ProcessEntity) {
    this.id = process.id;
    this.title = process.title;
    this.startDate = process.startDate;
    this.endDate = process.endDate;
    this.imageUrls = process.processImages.map((image) => new UserProcessViewImageItem(image));
    this.description = process.description;
  }
}
