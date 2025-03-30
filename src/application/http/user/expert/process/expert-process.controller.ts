import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MyApiOperation } from '@applications/decorators/my-api-operation.decorator';
import { ExpertProcessViewDto } from '@applications/http/user/expert/process/request/expert-process-view.dto';
import { ExpertProcessViewResponse } from '@applications/http/user/expert/process/response/expert-process-view.response';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { ExpertProcessStepsDto } from '@applications/http/user/expert/process/request/expert-process-steps.dto';
import { ExpertProcessStepsResponse } from '@applications/http/user/expert/process/response/expert-process-steps.response';
import { StepExpertsRepository } from '@domain/step/repository/step-experts.repository';
import { ReqUser } from '@applications/decorators/req-user.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ExpertProcessStepsParticipantsDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants.dto';
import { ExpertProcessStepsParticipantsResponse } from '@applications/http/user/expert/process/response/expert-process-steps-participants.response';
import { StepParticipantsRepository } from '@domain/step/repository/step-participants.repository';
import { ExpertProcessStepsParticipantsReactionDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-reaction.dto';
import { ExpertProcessStepsParticipantsReactionResponse } from '@applications/http/user/expert/process/response/expert-process-steps-participants-reaction.response';
import { ReactionRepository } from '@domain/reaction/repository/reaction.repository';
import { ExpertProcessStepsSchemaDto } from '@applications/http/user/expert/process/request/expert-process-steps-schema.dto';
import { ExpertProcessStepsSchemaResponse } from '@applications/http/user/expert/process/response/expert-process-steps-schema.response';
import { StepRepository } from '@domain/step/repository/step.repository';
import { FormSchemaRepository } from '@domain/form-schema/repository/form-schema.repository';
import { ExpertProcessStepsParticipantsFormDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-form.dto';
import { ExpertProcessStepsParticipantsFormResponse } from '@applications/http/user/expert/process/response/expert-process-steps-participants-form.response';
import { FormSchemaFilledRepository } from '@domain/form-schema/repository/form-schema-filled.repository';
import { ExpertProcessStepsParticipantsReactionAllDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-reaction-all.dto';
import { ExpertProcessStepsParticipantsReactionAllResponse } from '@applications/http/user/expert/process/response/expert-process-steps-participants-reaction-all.response';
import { ExpertProcessStepsParticipantsReactionMainDto } from '@applications/http/user/expert/process/request/expert-process-steps-participants-reaction-main.dto';

@Controller('user/expert/process')
export class ExpertProcessController {
  constructor(
    private readonly processRepository: ProcessRepository,
    private readonly stepExpertsRepository: StepExpertsRepository,
    private readonly stepParticipantsRepository: StepParticipantsRepository,
    private readonly reactionRepository: ReactionRepository,
    private readonly stepRepository: StepRepository,
    private readonly formSchemaRepository: FormSchemaRepository,
    private readonly formSchemaFilledRepository: FormSchemaFilledRepository,
  ) {}

  @MyApiOperation({
    rights: {
      process: {
        expert: true,
      },
    },
  })
  @Get('/view')
  async getProcessView(@Query() query: ExpertProcessViewDto): Promise<ExpertProcessViewResponse> {
    const process = await this.processRepository.findByIdWithParticipantsAndStepsOrFail(query.processId);

    return new ExpertProcessViewResponse(process);
  }

  @MyApiOperation({
    rights: {
      process: {
        expert: true,
      },
    },
  })
  @Get('/steps')
  async getProcessSteps(
    @Query() query: ExpertProcessStepsDto,
    @ReqUser() user: UserEntity,
  ): Promise<ExpertProcessStepsResponse> {
    const stepExperts = await this.stepExpertsRepository.findAllStepsForExpert({
      processId: query.processId,
      userId: user.id,
    });

    const steps = stepExperts.map((stepExpert) => stepExpert.step);

    return new ExpertProcessStepsResponse(steps);
  }

  @MyApiOperation({
    rights: {
      step: {
        expert: true,
      },
    },
  })
  @Get('/steps/participants')
  async getProcessStepExpertParticipants(
    @Query() query: ExpertProcessStepsParticipantsDto,
    @ReqUser() user: UserEntity,
  ): Promise<ExpertProcessStepsParticipantsResponse> {
    const [participants, count] = await this.stepParticipantsRepository.findAndCountStepParticipantsByStepId({
      processId: query.processId,
      expertUserId: user.id,
      stepId: query.stepId,
      limit: query.limit,
      offset: query.offset,
      nameFilter: query.nameFilter,
      surnameFilter: query.surnameFilter,
      patronymicFilter: query.patronymicFilter,
      emailFilter: query.emailFilter,
      isPassedToNextStep: query.isPassedToNextStep,
    });

    return new ExpertProcessStepsParticipantsResponse(participants, count);
  }

  @MyApiOperation({
    rights: {
      step: {
        expert: true,
      },
    },
  })
  @Get('/steps/participants/reaction')
  async getProcessStepExpertParticipantWithReaction(
    @Query() query: ExpertProcessStepsParticipantsReactionDto,
    @ReqUser() user: UserEntity,
  ): Promise<ExpertProcessStepsParticipantsReactionResponse> {
    const stepParticipant = await this.stepParticipantsRepository.findWithReactionAndFormOrFail({
      processId: query.processId,
      stepId: query.stepId,
      userId: query.userId,
    });

    const reaction = await this.reactionRepository.findOneByStepParticipantAndExpert({
      stepParticipantId: stepParticipant.id,
      userExpertId: user.id,
    });

    return new ExpertProcessStepsParticipantsReactionResponse(stepParticipant, reaction);
  }

  @MyApiOperation({
    rights: {
      step: {
        expert: true,
      },
    },
  })
  @Get('/steps/schema')
  async getProcessStepSchema(@Query() query: ExpertProcessStepsSchemaDto): Promise<ExpertProcessStepsSchemaResponse> {
    await this.stepRepository.findByProcessAndFormSchemaIdOrFail({
      processId: query.processId,
      formSchemaId: query.schemaId,
      stepId: query.stepId,
    });
    const res = await this.formSchemaRepository.findByIdOrFail(query.schemaId);

    return new ExpertProcessStepsSchemaResponse(res);
  }

  @MyApiOperation({
    rights: {
      step: {
        expert: true,
      },
    },
  })
  @Get('/steps/participants/form')
  async getProcessStepFilledSchema(
    @Query() query: ExpertProcessStepsParticipantsFormDto,
  ): Promise<ExpertProcessStepsParticipantsFormResponse> {
    await this.stepRepository.findByProcessAndFormSchemaIdOrFail({
      processId: query.processId,
      formSchemaId: query.schemaId,
      stepId: query.stepId,
    });

    const res = await this.formSchemaFilledRepository.findByIdAndSchemaIdOrFail({
      schemaId: query.schemaId,
      filledFormId: query.formId,
    });

    return new ExpertProcessStepsParticipantsFormResponse(res);
  }

  //todo guard для главного эксперта
  @MyApiOperation({
    rights: {
      step: {
        expert: true,
      },
    },
  })
  @Get('/steps/participants/reaction/all')
  async getProcessStepReactions(
    @Query() query: ExpertProcessStepsParticipantsReactionAllDto,
  ): Promise<ExpertProcessStepsParticipantsReactionAllResponse> {
    const stepParticipant = await this.stepParticipantsRepository.findWithReactionAndFormOrFail({
      processId: query.processId,
      stepId: query.stepId,
      userId: query.userId,
    });

    stepParticipant.reactions = await this.reactionRepository.findAllForStepParticipant(stepParticipant.id);

    return new ExpertProcessStepsParticipantsReactionAllResponse(stepParticipant);
  }

  //todo guard для главного эксперта
  @MyApiOperation({
    rights: {
      step: {
        expert: true,
      },
    },
  })
  @Post('/steps/participants/reaction/main')
  async setMainReaction(
    @Body() body: ExpertProcessStepsParticipantsReactionMainDto,
    @ReqUser() user: UserEntity,
  ): Promise<void> {
    const stepParticipant = await this.stepParticipantsRepository.findWithReactionAndFormOrFail({
      processId: body.processId,
      stepId: body.stepId,
      userId: body.userId,
    });

    const reaction = await this.reactionRepository.findOneByStepParticipantAndExpert({
      stepParticipantId: stepParticipant.id,
      userExpertId: user.id,
    });

    await this.stepParticipantsRepository.saveWithMainReaction({ stepParticipant, mainReaction: reaction });
  }
}
