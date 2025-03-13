import { Injectable } from '@nestjs/common';
import { StepEntity } from '@domain/step/entities/step.entity';
import { ProcessEntity } from '@domain/process/entities/process.entity';

@Injectable()
export class StepManager {
  createEntity(dto: {
    process: ProcessEntity;
    title: string;
    startTime: Date;
    endTime: Date;
    participantsCount: number | null;
    parent: StepEntity | null;
  }) {
    const step = new StepEntity();
    step.process = dto.process;
    step.title = dto.title;
    step.startTime = dto.startTime;
    step.endTime = dto.endTime;
    step.participantsCount = dto.participantsCount;
    step.parent = dto.parent;
    return step;
  }
}
