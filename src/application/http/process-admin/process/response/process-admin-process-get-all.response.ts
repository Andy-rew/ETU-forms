import { ProcessEntity } from '@domain/process/entities/process.entity';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { DateProperty } from '@applications/decorators/api/common/date.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { CountProperty } from '@applications/decorators/api/common/count.property.decorator';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';

class ProcessAdminProcessGetAllProcessItem {
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

  constructor(process: ProcessEntity) {
    this.id = process.id;
    this.status = process.status;
    this.title = process.title;
    this.startDate = process.startDate;
    this.endDate = process.endDate;
  }
}

export class ProcessAdminProcessGetAllResponse {
  @ArraySchemasProperty({
    item: ProcessAdminProcessGetAllProcessItem,
    description: 'Список процессов',
  })
  items: ProcessAdminProcessGetAllProcessItem[];

  @CountProperty()
  count: number;

  constructor(count: number, processes: ProcessEntity[]) {
    this.count = count;
    this.items = processes.map((process) => new ProcessAdminProcessGetAllProcessItem(process));
  }
}
