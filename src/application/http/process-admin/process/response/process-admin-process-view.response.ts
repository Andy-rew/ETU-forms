import { ProcessEntity } from '@domain/process/entities/process.entity';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateProperty } from '@applications/decorators/api/common/date.property.decorator';
import { FileEntity } from '@domain/file/entities/file.entity';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';

class ProcessAdminProcessViewImageItem {
  @IdProperty()
  id: number;

  @TextProperty({ description: 'URL изображения' })
  url: string;

  constructor(image: FileEntity) {
    this.id = image.id;
    this.url = image.url;
  }
}

export class ProcessAdminProcessViewResponse {
  @UuidProperty()
  id: string;

  @EnumApiProperty({ enum: ProcessStatusEnum, description: 'Статус процесса' })
  status: ProcessStatusEnum;

  @TextProperty({ description: 'Название процесса' })
  title: string;

  @DateProperty({ description: 'Дата начала процесса' })
  startDate: Date;

  @DateProperty({ description: 'Дата окончания процесса' })
  endDate: Date;

  @ArraySchemasProperty({
    item: ProcessAdminProcessViewImageItem,
    description: 'Список URL изображений процесса',
  })
  imageUrls: ProcessAdminProcessViewImageItem[];

  @TextProperty({ description: 'Описание процесса', nullable: true })
  description: string | null;

  constructor(process: ProcessEntity) {
    this.id = process.id;
    this.status = process.status;
    this.title = process.title;
    this.startDate = process.startDate;
    this.endDate = process.endDate;
    this.imageUrls = process.processImages.map((image) => new ProcessAdminProcessViewImageItem(image));
    this.description = process.description;
  }
}
