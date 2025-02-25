import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { BoolProperty, ObjectProperty } from '@ivankrtv/openapidoc/dist';
import { UserEntity } from '@domain/user/entities/user.entity';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { EmailProperty } from '@applications/decorators/api/common/email-property.decorator';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';

class ExpertProcessStepsParticipantsReactionAllExpertItem {
  @IdProperty()
  id: number;

  @TextProperty()
  name: string;

  @TextProperty()
  surname: string;

  @TextProperty()
  patronymic: string;

  @EmailProperty()
  email: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.surname = user.surname;
    this.patronymic = user.patronymic;
    this.email = user.email;
  }
}

class ExpertProcessStepsParticipantsReactionAllReactionItem {
  @IdProperty()
  reactionId: number;

  @BoolProperty({ description: 'Главная реакция?' })
  isMain: boolean;

  @EnumApiProperty({ enum: ReactionTypeEnum, description: 'Тип реакции' })
  type: ReactionTypeEnum;

  @ObjectProperty({ description: 'Эксперт, который оставил реакцию' })
  expert: ExpertProcessStepsParticipantsReactionAllExpertItem;

  @IdProperty({ description: 'Id заполненной формы реакции' })
  filedFormId: number;

  constructor(reaction: ReactionEntity, isMain: boolean) {
    this.isMain = isMain;
    this.reactionId = reaction.id;
    this.filedFormId = reaction.reactionFormFilled.id;
    this.type = reaction.type;
    this.expert = new ExpertProcessStepsParticipantsReactionAllExpertItem(reaction.reactedByUser);
  }
}

export class ExpertProcessStepsParticipantsReactionAllResponse {
  @ArraySchemasProperty({
    item: ExpertProcessStepsParticipantsReactionAllReactionItem,
    description: 'Список реакций',
  })
  reactions: ExpertProcessStepsParticipantsReactionAllReactionItem[];

  constructor(stepParticipantWithReactions: StepParticipantsEntity) {
    this.reactions = stepParticipantWithReactions.reactions.map(
      (reaction) =>
        new ExpertProcessStepsParticipantsReactionAllReactionItem(
          reaction,
          reaction.id === stepParticipantWithReactions.mainReaction.id,
        ),
    );
  }
}
