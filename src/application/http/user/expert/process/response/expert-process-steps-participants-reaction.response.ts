import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { EnumProperty, ObjectProperty } from '@ivankrtv/openapidoc/dist';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { UserEntity } from '@domain/user/entities/user.entity';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { EmailProperty } from '@applications/decorators/api/common/email-property.decorator';

class ExpertProcessStepsParticipantsReactionItem {
  @IdProperty({ description: 'Id реакции' })
  id: number;

  @EnumProperty({ enum: ReactionTypeEnum, description: 'Тип реакции' })
  type: ReactionTypeEnum;

  @IdProperty({ description: 'Id заполненной формы реакции' })
  reactionFilledFormId: number | null;

  constructor(reaction: ReactionEntity) {
    this.id = reaction.id;
    this.type = reaction.type;
    this.reactionFilledFormId = reaction.reactionFormFilled.id;
  }
}

class ExpertProcessStepsParticipantsUserItem {
  @IdProperty({ description: 'Id пользователя' })
  id: number;

  @EmailProperty()
  email: string;

  @TextProperty({ description: 'Имя пользователя' })
  name: string;

  @TextProperty({ description: 'Фамилия пользователя' })
  surname: string;

  @TextProperty({ description: 'Отчество пользователя', nullable: true })
  patronymic: string | null;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.surname = user.surname;
    this.patronymic = user.patronymic;
  }
}

export class ExpertProcessStepsParticipantsReactionResponse {
  @IdProperty({ description: 'Id участника этапа' })
  id: number;

  @IdProperty({ description: 'Id заполненной формы этапа' })
  filledFormId: number;

  @ObjectProperty({ description: 'Участник' })
  user: ExpertProcessStepsParticipantsUserItem;

  @ObjectProperty({ description: 'Реакция, будет null, если еще не проставлена', nullable: true })
  reaction: ExpertProcessStepsParticipantsReactionItem | null;

  constructor(stepParticipant: StepParticipantsEntity, reaction: ReactionEntity) {
    this.id = stepParticipant.id;
    this.filledFormId = stepParticipant.filledForm.id;
    this.user = new ExpertProcessStepsParticipantsUserItem(stepParticipant.processParticipant.user);
    this.reaction = reaction ? new ExpertProcessStepsParticipantsReactionItem(reaction) : null;
  }
}
