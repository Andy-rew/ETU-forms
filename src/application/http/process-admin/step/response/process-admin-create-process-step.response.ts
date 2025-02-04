import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { StepEntity } from '@domain/step/entities/step.entity';

export class ProcessAdminCreateProcessStepResponse {
  @IdProperty({ description: 'Id этапа' })
  id: number;

  constructor(step: StepEntity) {
    this.id = step.id;
  }
}
