import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';

@Entity('process_participants')
@Unique('user-process-participant', ['user', 'process'])
export class ProcessParticipantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.processParticipants, { nullable: false })
  user: UserEntity;

  @ManyToOne(() => ProcessEntity, (process: ProcessEntity) => process.userParticipants, { nullable: false })
  process: ProcessEntity;

  @OneToMany(
    () => StepParticipantsEntity,
    (stepParticipants: StepParticipantsEntity) => stepParticipants.processParticipant,
  )
  stepParticipants: StepParticipantsEntity[];
}
