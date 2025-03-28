import { BadRequestException, Injectable } from '@nestjs/common';
import { StepRepository } from '@domain/step/repository/step.repository';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { StepEntity } from '@domain/step/entities/step.entity';
import { UserEntity } from '@domain/user/entities/user.entity';
import { StepParticipantsRepository } from '@domain/step/repository/step-participants.repository';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

@Injectable()
export class StepUsersService {
  constructor(
    private readonly stepRepository: StepRepository,
    private readonly processRepository: ProcessRepository,
    private readonly stepParticipantsRepository: StepParticipantsRepository,
  ) {
    dayjs.extend(isBetween);
  }

  async getActualStepsForParticipant(dto: { processId: string; userId: number }): Promise<StepEntity[]> {
    const process = await this.processRepository.findByIdOrFail(dto.processId);

    if (process.linkAccess) {
      return this.stepRepository.findActualByProcessId(dto.processId);
    }

    if (!process.linkAccess) {
      return this.stepRepository.findActualByProcessIdForUser(dto);
    }
  }

  async stepApply(dto: {
    user: UserEntity;
    processId: string;
    stepId: number;
    formSchemaId: number;
    filledForm: JSON;
  }) {
    const stepParticipant = await this.stepParticipantsRepository.findWithReactionAndFormOrFail({
      userId: dto.user.id,
      stepId: dto.stepId,
      processId: dto.processId,
    });

    const step = stepParticipant.step;

    if (!dayjs().isBetween(step.startTime, step.endTime, 'minutes', '[]')) {
      throw new BadRequestException('Step is not active');
    }

    const stepForm = await this.stepRepository.findViewById(step.id);

    const formSchema = stepForm.formSchema;

    const filledForm = new FormSchemaFilledEntity();
    filledForm.schema = formSchema;
    filledForm.filledSchema = dto.filledForm;

    await this.stepParticipantsRepository.saveWithFilledForm({ stepParticipant, filledForm });
  }
}
