import { StepEntity } from '@domain/step/entities/step.entity';
import * as dayjs from 'dayjs';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { INestApplication } from '@nestjs/common';
import { CommonStepService } from '@domain/step/services/common-step.service';
import { ProcessBuilder } from './process.builder';

export class StepBuilder {
  constructor(private readonly app: INestApplication) {}

  private title = 'Тестовый этап';
  private startTime = dayjs().add(1, 'day').toDate();
  private endTime = dayjs().add(2, 'day').toDate();
  private participantsCount: number | null = null;
  private parent: StepEntity | null = null;
  private process: ProcessEntity | null = null;

  public withProcess(process: ProcessEntity): this {
    this.process = process;
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
    return step;
  }

  async build() {
    if (!this.process) {
      this.process = await new ProcessBuilder(this.app).build();
    }

    const step = this.buildEntity();
    return this.app.get(CommonStepService).create({
      processId: this.process.id,
      title: step.title,
      startTime: step.startTime,
      endTime: step.endTime,
      participantsCount: step.participantsCount,
      parentId: step.parent?.id || null,
    });
  }
}
