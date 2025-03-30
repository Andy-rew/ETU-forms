import { Injectable } from '@nestjs/common';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';

@Injectable()
export class ReactionManager {
  createEntity(dto: {
    stepParticipant: StepParticipantsEntity;
    formSchema: FormSchemaEntity;
    filledReaction: JSON;
    userReactedBy: UserEntity;
    type: ReactionTypeEnum;
  }) {
    const filledForm = new FormSchemaFilledEntity();
    filledForm.filledSchema = dto.filledReaction;
    filledForm.schema = dto.formSchema;

    const reaction = new ReactionEntity();
    reaction.reactionFormFilled = filledForm;
    reaction.stepParticipant = dto.stepParticipant;
    reaction.reactedByUser = dto.userReactedBy;
    reaction.type = dto.type;
    return reaction;
  }
}
