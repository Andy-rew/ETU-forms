import { StepEntity } from '@domain/step/entities/step.entity';
import * as dayjs from 'dayjs';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { INestApplication } from '@nestjs/common';
import { CommonStepService } from '@domain/step/services/common-step.service';
import { ProcessBuilder } from './process.builder';
import { UserEntity } from '@domain/user/entities/user.entity';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';

export class StepBuilder {
  constructor(private readonly app: INestApplication) {}

  private title = 'Тестовый этап';
  private startTime = dayjs().add(1, 'day').toDate();
  private endTime = dayjs().add(2, 'day').toDate();
  private participantsCount: number | null = null;
  private parent: StepEntity | null = null;
  private process: ProcessEntity | null = null;
  private experts: UserEntity[] | null = null;
  private acceptFormSchema: FormSchemaEntity = null;
  private declineFormSchema: FormSchemaEntity = null;
  private formSchema: FormSchemaEntity = null;
  private processParticipants: ProcessParticipantEntity[] = [];

  public withProcess(process: ProcessEntity): this {
    this.process = process;
    return this;
  }

  public withExperts(experts: UserEntity[]): this {
    this.experts = experts;
    return this;
  }

  public withAcceptFormSchema(acceptFormSchema: FormSchemaEntity): this {
    this.acceptFormSchema = acceptFormSchema;
    return this;
  }

  public withProcessParticipants(processParticipants: ProcessParticipantEntity[]): this {
    this.processParticipants = processParticipants;
    return this;
  }

  public withDeclineFormSchema(declineFormSchema: FormSchemaEntity): this {
    this.declineFormSchema = declineFormSchema;
    return this;
  }

  public withFormSchema(formSchema: FormSchemaEntity): this {
    this.formSchema = formSchema;
    return this;
  }

  buildEntity() {
    const step = new StepEntity();
    step.title = this.title;
    step.startTime = this.startTime;
    step.endTime = this.endTime;
    step.participantsCount = this.participantsCount;
    step.parent = this.parent;
    step.process = this.process;
    step.formSchema = this.formSchema;
    step.formAcceptSchema = this.acceptFormSchema;
    step.formDeclineSchema = this.declineFormSchema;
    return step;
  }

  async build() {
    if (!this.process) {
      this.process = await new ProcessBuilder(this.app).build();
    }

    const step = this.buildEntity();
    const stepCreated = await this.app.get(CommonStepService).create({
      processId: this.process.id,
      title: step.title,
      startTime: step.startTime,
      endTime: step.endTime,
      participantsCount: step.participantsCount,
      parentId: step.parent?.id || null,
    });

    if (this.processParticipants.length) {
      const stepParticipants = [];

      this.processParticipants.forEach((participant) => {
        const stepParticipant = new StepParticipantsEntity();
        stepParticipant.step = stepCreated;
        stepParticipant.processParticipant = participant;
        stepParticipants.push(stepParticipant);
      });

      await this.app
        .get<Repository<StepParticipantsEntity>>(getRepositoryToken(StepParticipantsEntity))
        .save(stepParticipants);

      stepCreated.participants = stepParticipants;
    }

    stepCreated.formSchema = this.formSchema;
    stepCreated.formAcceptSchema = this.acceptFormSchema;
    stepCreated.formDeclineSchema = this.declineFormSchema;

    return this.app.get<Repository<StepEntity>>(getRepositoryToken(StepEntity)).save(stepCreated);
  }
}
