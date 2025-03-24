import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';

export class ProcessAdminUpdateProcessStepSchemaDto {
  @UuidProperty('Id процесса')
  processId: string;

  @IdProperty({ description: 'Id этапа' })
  stepId: number;

  @EnumApiProperty({ enum: SchemaType, description: 'Тип шаблона для форм' })
  type: SchemaType;

  @IdProperty({ description: 'Id шаблона, передавать null чтобы сбросить', nullable: true })
  schemaId: number | null;
}
