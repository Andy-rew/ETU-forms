import { ProcessEntity } from '@domain/process/entities/process.entity';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminProcessCreateFromTemplateResponse {
  @UuidProperty()
  id: string;

  constructor(process: ProcessEntity) {
    this.id = process.id;
  }
}
