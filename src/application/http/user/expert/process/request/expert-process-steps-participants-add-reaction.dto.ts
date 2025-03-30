import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { StringProperty } from '@ivankrtv/openapidoc/dist';

export class ExpertProcessStepsParticipantsAddReactionDto {
  @UuidProperty()
  processId: string;

  @IdProperty()
  stepId: number;

  @IdProperty({
    description: 'Id пользователя участника этапа',
  })
  userId: number;

  @IdProperty({
    description: 'Id шаблона формы реакции',
  })
  schemaId: number;

  @EnumApiProperty({
    enum: ReactionTypeEnum,
    description: 'Тип реакции',
  })
  type: ReactionTypeEnum;

  @StringProperty({ description: 'JSON результат заполненной формы реакции', example: '' })
  filledReaction: JSON;
}
