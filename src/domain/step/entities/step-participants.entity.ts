import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { StepEntity } from '@domain/step/entities/step.entity';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';

@Entity('step_participants')
@Unique('step_process_participants', ['processParticipant', 'step'])
export class StepParticipantsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ProcessParticipantEntity,
    (processParticipant: ProcessParticipantEntity) => processParticipant.stepParticipants,
    { nullable: false },
  )
  processParticipant: ProcessParticipantEntity;

  @OneToOne(() => FormSchemaFilledEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'filled_form_id' })
  filledForm: FormSchemaFilledEntity | null;

  @ManyToOne(() => StepEntity, (step: StepEntity) => step.participants, { nullable: false })
  step: StepEntity;

  @OneToMany(() => ReactionEntity, (reaction: ReactionEntity) => reaction.stepParticipant)
  reactions: ReactionEntity[];

  @OneToOne(() => ReactionEntity)
  @JoinColumn({ name: 'main_reaction_id' })
  mainReaction: ReactionEntity | null;
}
