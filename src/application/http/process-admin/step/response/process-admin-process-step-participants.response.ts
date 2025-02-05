import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { EmailProperty } from '@applications/decorators/api/common/email-property.decorator';
import { TextProperty } from '@applications/decorators/api/common/text-property.decorator';
import { CountProperty } from '@applications/decorators/api/common/count.property.decorator';
import { ArraySchemasProperty } from '@applications/decorators/api/helpers/array-schemas.property.decorator';
import { BoolProperty } from '@ivankrtv/openapidoc/dist';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';

class ProcessAdminProcessStepParticipantsItem {
  @IdProperty({ description: 'Id участника этапа' })
  id: number;

  @IdProperty({ description: 'Id пользователя' })
  userId: number;

  @EmailProperty()
  email: string;

  @TextProperty({ description: 'Имя пользователя' })
  name: string;

  @TextProperty({ description: 'Фамилия пользователя' })
  surname: string;

  @TextProperty({ description: 'Отчество пользователя' })
  patronymic: string;

  @BoolProperty({ description: 'Проходит на следующий этап' })
  passedToTheNextStep: boolean;

  constructor(stepParticipant: StepParticipantsEntity) {
    this.id = stepParticipant.id;
    this.userId = stepParticipant.processParticipant.user.id;
    this.email = stepParticipant.processParticipant.user.email;
    this.name = stepParticipant.processParticipant.user.name;
    this.surname = stepParticipant.processParticipant.user.surname;
    this.patronymic = stepParticipant.processParticipant.user.patronymic;
    this.passedToTheNextStep = stepParticipant.mainReaction
      ? stepParticipant.mainReaction.type === ReactionTypeEnum.accept
      : false;
  }
}

export class ProcessAdminProcessStepParticipantsResponse {
  @ArraySchemasProperty({
    item: ProcessAdminProcessStepParticipantsItem,
    description: 'Список участников этапа',
  })
  stepParticipants: ProcessAdminProcessStepParticipantsItem[];

  @CountProperty()
  count: number;

  constructor(stepParticipants: StepParticipantsEntity[], count: number) {
    this.count = count;
    this.stepParticipants = stepParticipants.map(
      (stepParticipant) => new ProcessAdminProcessStepParticipantsItem(stepParticipant),
    );
  }
}
