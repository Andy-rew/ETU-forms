import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { CountProperty } from '@applications/decorators/api/common/count.property.decorator';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { BoolProperty, IntProperty } from '@ivankrtv/openapidoc/dist';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { EmailProperty } from '@applications/decorators/api/common/email-property.decorator';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';

class ExpertProcessStepsParticipantsItem {
  @IdProperty({ description: 'Id участника этапа' })
  id: number;

  @BoolProperty({
    description: 'Проходит на следующий этап?',
  })
  isPassedToNextStep: boolean;

  @IntProperty({
    description: 'Количество положительных реакции',
    example: 1,
  })
  positiveReactionsCount: number;

  @IntProperty({
    description: 'Количество отрицательных реакции',
    example: 1,
  })
  negativeReactionsCount: number;

  @TextProperty({
    description: 'Имя участника этапа',
  })
  name: string;

  @TextProperty({
    description: 'Фамилия участника этапа',
  })
  surname: string;

  @TextProperty({
    description: 'Отчество участника этапа',
    nullable: true,
  })
  patronymic: string | null;

  @EmailProperty()
  email: string;

  @IdProperty({ description: 'Id заполненной формы участника этапа', nullable: true })
  filledFormId: number | null;

  constructor(stepParticipant: StepParticipantsEntity) {
    this.id = stepParticipant.id;
    this.name = stepParticipant.processParticipant.user.name;
    this.surname = stepParticipant.processParticipant.user.surname;
    this.patronymic = stepParticipant.processParticipant.user.patronymic;
    this.email = stepParticipant.processParticipant.user.email;
    this.filledFormId = stepParticipant.filledForm?.id || null;
    this.isPassedToNextStep = stepParticipant.mainReaction
      ? stepParticipant.mainReaction.type === ReactionTypeEnum.accept
      : false;

    this.positiveReactionsCount = stepParticipant.reactions.filter(
      (reaction) => reaction.type === ReactionTypeEnum.accept,
    ).length;

    this.negativeReactionsCount = stepParticipant.reactions.filter(
      (reaction) => reaction.type === ReactionTypeEnum.decline,
    ).length;
  }
}

export class ExpertProcessStepsParticipantsResponse {
  @ArraySchemasProperty({
    item: ExpertProcessStepsParticipantsItem,
    description: 'Список участников этапа процесса',
  })
  items: ExpertProcessStepsParticipantsItem[];

  @CountProperty()
  count: number;

  constructor(items: StepParticipantsEntity[], count: number) {
    this.items = items.map((item) => new ExpertProcessStepsParticipantsItem(item));
    this.count = count;
  }
}
