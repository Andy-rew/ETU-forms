import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReactionTypeEnum } from '@domain/reaction/enums/reaction-type.enum';
import { IsEnum } from 'class-validator';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { UserEntity } from '@domain/user/entities/user.entity';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { StepExpertsParticipantsEntity } from '@domain/step/entities/step-experts-participants.entity';

@Entity('reactions')
export class ReactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ReactionTypeEnum, default: ReactionTypeEnum.decline })
  @IsEnum(ReactionTypeEnum)
  type: ReactionTypeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => FormSchemaFilledEntity, { nullable: false })
  @JoinColumn({ name: 'reaction_form_filled_id' })
  reactionFormFilled: FormSchemaFilledEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.reactions, { nullable: false })
  reactedByUser: UserEntity;

  @ManyToOne(() => StepParticipantsEntity, (stepParticipant: StepParticipantsEntity) => stepParticipant.reactions, {
    nullable: false,
  })
  stepParticipant: StepParticipantsEntity;

  @OneToOne(
    () => StepExpertsParticipantsEntity,
    (stepExpertsParticipant: StepExpertsParticipantsEntity) => stepExpertsParticipant.reaction,
  )
  stepExpertsParticipant: StepExpertsParticipantsEntity;
}
