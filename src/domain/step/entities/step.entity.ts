import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';

@Entity('steps')
export class StepEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  participantsCount: number | null;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => ProcessEntity, (process: ProcessEntity) => process.steps, { nullable: false })
  process: ProcessEntity;

  @OneToOne(() => FormSchemaEntity, { nullable: true })
  @JoinColumn({ name: 'form_schema_id' })
  formSchema: FormSchemaEntity;

  @OneToOne(() => FormSchemaEntity, { nullable: true })
  @JoinColumn({ name: 'form_accept_schema_id' })
  formAcceptSchema: FormSchemaEntity;

  @OneToOne(() => FormSchemaEntity, { nullable: true })
  @JoinColumn({ name: 'form_decline_schema_id' })
  formDeclineSchema: FormSchemaEntity;

  @OneToOne(() => StepEntity, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: StepEntity | null;

  @OneToMany(() => StepExpertsEntity, (user: StepExpertsEntity) => user.step)
  experts: StepExpertsEntity[];

  @OneToMany(() => StepParticipantsEntity, (stepParticipants: StepParticipantsEntity) => stepParticipants.step)
  participants: StepParticipantsEntity[];
}
