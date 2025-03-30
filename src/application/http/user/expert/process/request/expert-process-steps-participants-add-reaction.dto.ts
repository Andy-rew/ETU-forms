import { UuidProperty } from '@applications/decorators/api/common/uuid.property.decorator';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';

export class ExpertProcessStepsParticipantsAddReactionDto {
  @UuidProperty()
  processId: string;

  @IdProperty()
  stepId: number;

  @IdProperty({
    description: 'Id пользователя участника этапа',
  })
  userId: number;

  @EnumApiProperty({
    enum: ReactionTypeEnum,
    description: 'Тип реакции',
  })
  type: ReactionTypeEnum;

  @TextProperty({
    description: 'Заполненная форма реакции',
  })
  filledReaction: JSON;
}
