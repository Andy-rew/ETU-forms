import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { BoolProperty } from '@ivankrtv/openapidoc/dist';
import { IsBoolean, IsOptional } from 'class-validator';

export class ExpertProcessStepsParticipantsDto {
  @UuidProperty()
  processId: string;

  @IdProperty()
  stepId: number;

  @TextProperty({ description: 'Фильтр по имени', example: 'Иван', isOptional: true })
  nameFilter?: string;

  @TextProperty({ description: 'Фильтр по фамилии', example: 'Иванов', isOptional: true })
  surnameFilter?: string;

  @TextProperty({ description: 'Фильтр по отчеству', example: 'Иванович', isOptional: true })
  patronymicFilter?: string;

  @TextProperty({ description: 'Фильтр по email', example: 'email@example.com', isOptional: true })
  emailFilter?: string;

  @BoolProperty({
    description: 'Фильтр по признаку прохождения на следующий этап',
    isOptional: true,
  })
  @IsBoolean()
  @IsOptional()
  isPassedToNextStep?: boolean;
}
