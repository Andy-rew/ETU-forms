import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum, IsUUID } from 'class-validator';
import { FileEntity } from '@domain/file/entities/file.entity';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { ProcessManagersEntity } from '@domain/process/entities/process-managers.entity';
import { StepEntity } from '@domain/step/entities/step.entity';

@Entity('processes')
export class ProcessEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ type: 'enum', enum: ProcessStatusEnum, default: ProcessStatusEnum.draft })
  @IsEnum(ProcessStatusEnum)
  status: ProcessStatusEnum;

  @Column()
  title: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false })
  linkAccess: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToMany(() => FileEntity, (file: FileEntity) => file.processes)
  @JoinTable({ name: 'process_images' })
  processImages: FileEntity[];

  @OneToMany(() => ProcessParticipantEntity, (participant: ProcessParticipantEntity) => participant.process)
  userParticipants: ProcessParticipantEntity[];

  @OneToMany(() => ProcessManagersEntity, (manager: ProcessManagersEntity) => manager.process)
  userManagers: ProcessManagersEntity[];

  @OneToMany(() => StepEntity, (step: StepEntity) => step.process)
  steps: StepEntity;
}
