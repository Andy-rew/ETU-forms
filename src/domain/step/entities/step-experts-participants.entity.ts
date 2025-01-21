import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';

@Entity('step_experts_participants')
@Unique('step_experts_participants_unique', ['stepExpert', 'stepParticipant'])
export class StepExpertsParticipantsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StepExpertsEntity, (stepExpert: StepExpertsEntity) => stepExpert.participants, { nullable: false })
  stepExpert: StepExpertsEntity;

  @ManyToOne(() => StepParticipantsEntity, (stepParticipant: StepParticipantsEntity) => stepParticipant.experts, {
    nullable: false,
  })
  stepParticipant: StepParticipantsEntity;

  @OneToOne(() => ReactionEntity, { nullable: true })
  @JoinColumn({ name: 'reaction_id' })
  reaction: ReactionEntity | null;
}
