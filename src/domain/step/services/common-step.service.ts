import { BadRequestException, Injectable } from '@nestjs/common';
import { StepRepository } from '@domain/step/repositories/step.repository';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { StepManager } from '@domain/step/managers/step.manager';
import { StepEntity } from '@domain/step/entities/step.entity';

@Injectable()
export class CommonStepService {
  constructor(
    private readonly stepRepository: StepRepository,
    private readonly processRepository: ProcessRepository,
    private readonly stepManager: StepManager,
  ) {}

  async create(dto: {
    processId: string;
    title: string;
    startTime: Date;
    endTime: Date;
    participantsCount: number | null;
    parentId: number | null;
  }) {
    const process = await this.processRepository.findByIdWitParticipantsAndStepsOrFail(dto.processId);

    if (process.steps.find((step) => step.parent === null) && dto.parentId === null) {
      throw new BadRequestException('First step already exists. Pass parent step id');
    }

    let parentStep: StepEntity = null;

    if (dto.parentId) {
      parentStep = await this.stepRepository.findOneWithProcessByIdOrFail(dto.parentId);

      if (process.steps.find((step) => step.parent?.id === dto.parentId)) {
        throw new BadRequestException('Step with such parent id already exists');
      }

      if (parentStep.process.id !== process.id) {
        throw new BadRequestException('Parent step does not belong to the process');
      }

      if (dto.participantsCount === null) {
        throw new BadRequestException('Participants count is required for not first step');
      }

      // если родительский этап первый - то у него количество участников = количеству участников процесса
      const parentParticipantsCount = parentStep.parent
        ? parentStep.participantsCount
        : process.userParticipants.length;

      if (parentParticipantsCount < dto.participantsCount) {
        throw new BadRequestException(
          'Step participants count cannot be greater than previous step participants count (first step participants count = process participants count)',
        );
      }
    }

    const newStep = this.stepManager.createEntity({
      process,
      title: dto.title,
      startTime: dto.startTime,
      endTime: dto.endTime,
      participantsCount: dto.participantsCount,
      parent: parentStep,
    });

    return this.stepRepository.saveNewStep(newStep);
  }
}
