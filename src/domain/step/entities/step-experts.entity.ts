import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { StepEntity } from '@domain/step/entities/step.entity';
import { StepExpertsParticipantsEntity } from '@domain/step/entities/step-experts-participants.entity';

@Entity('step_experts')
@Unique('step_experts_unique', ['user', 'step'])
export class StepExpertsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', default: false })
  isMain: boolean;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.stepExperts, { nullable: false })
  user: UserEntity;

  @ManyToOne(() => StepEntity, (step: StepEntity) => step.experts, { nullable: false })
  step: StepEntity;

  @OneToMany(() => StepExpertsParticipantsEntity, (stepExpert: StepExpertsParticipantsEntity) => stepExpert.stepExpert)
  participants: StepExpertsParticipantsEntity[];
}
