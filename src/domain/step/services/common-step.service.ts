import { BadRequestException, Injectable } from '@nestjs/common';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { StepManager } from '@domain/step/managers/step.manager';
import { StepEntity } from '@domain/step/entities/step.entity';
import { StepRepository } from '@domain/step/repository/step.repository';
import * as dayjs from 'dayjs';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { FormSchemaRepository } from '@domain/form-schema/repository/form-schema.repository';

@Injectable()
export class CommonStepService {
  constructor(
    private readonly stepRepository: StepRepository,
    private readonly processRepository: ProcessRepository,
    private readonly formSchemaRepository: FormSchemaRepository,
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

    if (dayjs(dto.startTime).isAfter(dto.endTime, 'minutes')) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (dayjs(process.startDate).isAfter(dto.startTime, 'minutes')) {
      throw new BadRequestException('Step start time must be after process start date');
    }

    if (dayjs(process.endDate).isBefore(dto.endTime, 'minutes')) {
      throw new BadRequestException('Step end time must be before process end date');
    }

    let parentStep: StepEntity = null;

    if (dto.parentId) {
      parentStep = await this.stepRepository.findOneWithProcessByIdOrFail(dto.parentId);

      if (process.steps.find((step) => step.parent?.id === dto.parentId)) {
        throw new BadRequestException('Step with such parent id already exists');
      }

      if (dayjs(dto.startTime).isBefore(parentStep.endTime, 'minutes')) {
        throw new BadRequestException('Step start time must be after parent step end time');
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

  async edit(dto: {
    processId: string;
    stepId: number;
    title: string;
    startTime: Date;
    endTime: Date;
    participantsCount: number | null;
  }) {
    const step = await this.stepRepository.findOneByIdAndProcessIdOrFail({
      stepId: dto.stepId,
      processId: dto.processId,
    });

    if (dayjs(dto.startTime).isAfter(dto.endTime, 'minutes')) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (dayjs(step.process.startDate).isAfter(dto.startTime, 'minutes')) {
      throw new BadRequestException('Step start time must be after process start date');
    }

    if (dayjs(step.process.endDate).isBefore(dto.endTime, 'minutes')) {
      throw new BadRequestException('Step end time must be before process end date');
    }

    if (step.parent) {
      const parentStep = step.parent;

      if (dayjs(dto.startTime).isBefore(parentStep.endTime, 'minutes')) {
        throw new BadRequestException('Step start time must be after parent step end time');
      }

      if (dto.participantsCount === null) {
        throw new BadRequestException('Participants count is required for not first step');
      }
    }

    const updatedStep = this.stepManager.updateEntity({
      step,
      title: dto.title,
      startTime: dto.startTime,
      endTime: dto.endTime,
      participantsCount: dto.participantsCount,
    });

    return this.stepRepository.commonUpdate(updatedStep);
  }

  async editSchema(dto: {
    processId: string;
    stepId: number;
    type: SchemaType;
    schemaId: number | null;
  }): Promise<StepEntity> {
    const step = await this.stepRepository.findOneByIdAndProcessIdOrFail({
      stepId: dto.stepId,
      processId: dto.processId,
    });

    const formSchema = dto.schemaId ? await this.formSchemaRepository.findByIdOrFail(dto.schemaId) : null;

    switch (dto.type) {
      case SchemaType.form:
        step.formSchema = formSchema;
        break;
      case SchemaType.accept:
        step.formAcceptSchema = formSchema;
        break;
      case SchemaType.decline:
        step.formDeclineSchema = formSchema;
        break;
      default:
        throw new BadRequestException('Invalid schema type');
    }

    return this.stepRepository.commonUpdate(step);
  }
}
