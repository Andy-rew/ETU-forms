import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { ObjectProperty } from '@ivankrtv/openapidoc/dist';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { IdProperty } from '@applications/decorators/api/common/id.property.decorator';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { EnumApiProperty } from '@applications/decorators/api/common/enum-api.property';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';

class ProcessAdminProcessStepParticipantFormReactionItem {
  @IdProperty()
  id: number;

  @EnumApiProperty({ enum: ReactionTypeEnum, description: 'Тип реакции' })
  type: ReactionTypeEnum;

  @IdProperty({ description: 'Id заполненной формы реакции' })
  reactionFilledFormId: number;

  @IdProperty({ description: 'Id шаблона реакции' })
  reactionSchemaId: number;

  constructor(reaction: ReactionEntity) {
    this.id = reaction.id;
    this.type = reaction.type;
    this.reactionFilledFormId = reaction.reactionFormFilled.id;
    this.reactionSchemaId = reaction.reactionFormFilled.schema.id;
  }
}

class ProcessAdminProcessStepParticipantFormItem {
  @IdProperty({ description: 'Id шаблона участника' })
  formSchemaId: number;

  @IdProperty({ description: 'Id заполненной формы участника' })
  filledFormId: number;

  constructor(form: FormSchemaFilledEntity) {
    this.formSchemaId = form.schema.id;
    this.filledFormId = form.id;
  }
}

export class ProcessAdminProcessStepParticipantFormResponse {
  @ObjectProperty({ description: 'Реакций эксперта', nullable: true })
  reaction: ProcessAdminProcessStepParticipantFormReactionItem | null;

  @ObjectProperty({ description: 'Форма участника', nullable: true })
  form: ProcessAdminProcessStepParticipantFormItem | null;

  constructor(stepParticipant: StepParticipantsEntity) {
    this.reaction = stepParticipant.mainReaction
      ? new ProcessAdminProcessStepParticipantFormReactionItem(stepParticipant.mainReaction)
      : null;

    this.form = stepParticipant.filledForm
      ? new ProcessAdminProcessStepParticipantFormItem(stepParticipant.filledForm)
      : null;
  }
}
