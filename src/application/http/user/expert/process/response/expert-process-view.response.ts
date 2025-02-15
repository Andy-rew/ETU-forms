import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { DateProperty } from '@applications/decorators/api/common/date.property.decorator';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { FileEntity } from '@domain/file/entities/file.entity';
import { StepEntity } from '@domain/step/entities/step.entity';

class ExpertProcessViewImageItem {
  @IdProperty()
  id: number;

  @TextProperty({ description: 'URL изображения' })
  url: string;

  constructor(image: FileEntity) {
    this.id = image.id;
    this.url = image.url;
  }
}

class ExpertProcessViewStepItem {
  @IdProperty()
  id: number;

  @IdProperty({ description: 'Id родительского этапа (после которого данный). Для первого = null', nullable: true })
  parentId: number | null;

  constructor(step: StepEntity) {
    this.id = step.id;
    this.parentId = step.parent?.id || null;
  }
}

export class ExpertProcessViewResponse {
  @UuidProperty()
  id: string;

  @TextProperty({ description: 'Название процесса' })
  title: string;

  @DateProperty({ description: 'Дата начала процесса' })
  startDate: Date;

  @DateProperty({ description: 'Дата окончания процесса' })
  endDate: Date;

  @ArraySchemasProperty({
    item: ExpertProcessViewImageItem,
    description: 'Список URL изображений процесса',
  })
  imageUrls: ExpertProcessViewImageItem[];

  @ArraySchemasProperty({
    item: ExpertProcessViewStepItem,
    description: 'Список этапов процесса',
  })
  steps: ExpertProcessViewStepItem[];

  @TextProperty({ description: 'Описание процесса', nullable: true })
  description: string | null;

  constructor(process: ProcessEntity) {
    this.id = process.id;
    this.title = process.title;
    this.startDate = process.startDate;
    this.endDate = process.endDate;
    this.imageUrls = process.processImages.map((image) => new ExpertProcessViewImageItem(image));
    this.steps = process.steps.map((step) => new ExpertProcessViewStepItem(step));
    this.description = process.description;
  }
}
