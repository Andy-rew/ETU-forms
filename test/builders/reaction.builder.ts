import { INestApplication } from '@nestjs/common';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { ReactionRepository } from '@domain/reaction/repository/reaction.repository';
import { UserBuilder } from './user.builder';

export class ReactionBuilder {
  constructor(private readonly app: INestApplication) {}

  private type: ReactionTypeEnum = ReactionTypeEnum.accept;
  private filledReactionForm: FormSchemaFilledEntity = null;
  private stepParticipant: StepParticipantsEntity = null;
  private reactedUser: UserEntity = null;

  withType(type: ReactionTypeEnum): this {
    this.type = type;
    return this;
  }

  withFilledReactionForm(filledReactionForm: FormSchemaFilledEntity): this {
    this.filledReactionForm = filledReactionForm;
    return this;
  }

  withStepParticipant(stepParticipant: StepParticipantsEntity): this {
    this.stepParticipant = stepParticipant;
    return this;
  }

  withReactedUser(reactedUser: UserEntity): this {
    this.reactedUser = reactedUser;
    return this;
  }

  buildEntity() {
    const reaction = new ReactionEntity();
    reaction.type = this.type;
    reaction.reactionFormFilled = this.filledReactionForm;
    reaction.reactedByUser = this.reactedUser;
    reaction.stepParticipant = this.stepParticipant;
    return reaction;
  }

  async build(): Promise<ReactionEntity> {
    if (!this.reactedUser) {
      this.reactedUser = await new UserBuilder(this.app).build();
    }

    const reaction = this.buildEntity();
    await this.app.get(ReactionRepository).save(reaction);
    return reaction;
  }
}
