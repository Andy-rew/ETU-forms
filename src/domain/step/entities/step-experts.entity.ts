import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { StepEntity } from '@domain/step/entities/step.entity';

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
}
