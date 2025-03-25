import { Injectable } from '@nestjs/common';
import { StepEntity } from '@domain/step/entities/step.entity';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { StepExpertsParticipantsEntity } from '@domain/step/entities/step-experts-participants.entity';

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

  updateEntity(dto: {
    step: StepEntity;
    title: string;
    startTime: Date;
    endTime: Date;
    participantsCount: number | null;
  }) {
    const step = dto.step;
    step.title = dto.title;
    step.startTime = dto.startTime;
    step.endTime = dto.endTime;
    step.participantsCount = dto.participantsCount;
    return step;
  }

  createStepExpertParticipantsEntity(dto: {
    stepExpert: StepExpertsEntity;
    stepParticipants: StepParticipantsEntity[];
  }): StepExpertsParticipantsEntity[] {
    const experts: StepExpertsParticipantsEntity[] = [];

    for (const stepParticipant of dto.stepParticipants) {
      const expert = new StepExpertsParticipantsEntity();
      expert.stepParticipant = stepParticipant;
      expert.stepExpert = dto.stepExpert;
      expert.reaction = null;
      experts.push(expert);
    }

    return experts;
  }
}
