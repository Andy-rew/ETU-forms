import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { ProcessEntity } from '@domain/process/entities/process.entity';

export class ProcessAdminProcessCreateResponse {
  @UuidProperty()
  id: string;

  constructor(process: ProcessEntity) {
    this.id = process.id;
  }
}
