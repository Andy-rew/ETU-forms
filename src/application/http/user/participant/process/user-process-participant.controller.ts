import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MyApiOperation } from '@applications/decorators/my-api-operation.decorator';
import { UserProcessViewDto } from '@applications/http/user/participant/process/request/user-process-view.dto';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { UserProcessViewResponse } from '@applications/http/user/participant/process/response/user-process-view.response';
import { UserProcessMyStepsDto } from '@applications/http/user/participant/process/request/user-process-my-steps.dto';
import { StepUsersService } from '@domain/step/services/step-users.service';
import { ReqUser } from '@applications/decorators/req-user.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserProcessMyStepsResponse } from '@applications/http/user/participant/process/response/user-process-my-steps.response';
import { UserProcessStepSchemaDto } from '@applications/http/user/participant/process/request/user-process-step-schema.dto';
import { StepRepository } from '@domain/step/repository/step.repository';
import { UserProcessStepSchemaResponse } from '@applications/http/user/participant/process/response/user-process-step-schema.response';
import { UserProcessStepFormFilledDto } from '@applications/http/user/participant/process/request/user-process-step-form-filled.dto';
import { UserProcessStepFormFilledResponse } from '@applications/http/user/participant/process/response/user-process-step-form-filled.response';
import { StepParticipantsRepository } from '@domain/step/repository/step-participants.repository';
import { UserProcessStepReactionDto } from '@applications/http/user/participant/process/request/user-process-step-reaction.dto';
import { UserProcessStepReactionResponse } from '@applications/http/user/participant/process/response/user-process-step-reaction.response';
import { UserProcessStepReactionSchemaDto } from '@applications/http/user/participant/process/request/user-process-step-reaction-schema.dto';
import { UserProcessStepReactionSchemaResponse } from '@applications/http/user/participant/process/response/user-process-step-reaction-schema.response';
import { FormSchemaRepository } from '@domain/form-schema/repository/form-schema.repository';
import { ReactionRepository } from '@domain/reaction/repository/reaction.repository';
import { UserProcessStepReactionSchemaFilledDto } from '@applications/http/user/participant/process/request/user-process-step-reaction-schema-filled.dto';
import { UserProcessStepReactionSchemaFilledResponse } from '@applications/http/user/participant/process/response/user-process-step-reaction-schema-filled.response';
import { UserProcessStepApplyDto } from '@applications/http/user/participant/process/request/user-process-step-apply.dto';

@Controller('user/process/participant')
export class UserProcessParticipantController {
  constructor(
    private readonly processRepository: ProcessRepository,
    private readonly stepRepository: StepRepository,
    private readonly stepParticipantsRepository: StepParticipantsRepository,
    private readonly stepUsersService: StepUsersService,
    private readonly formSchemaRepository: FormSchemaRepository,
    private readonly reactionRepository: ReactionRepository,
  ) {}

  @MyApiOperation({
    rights: {
      process: {
        participant: true,
      },
    },
  })
  @Get('/view')
  async getProcessView(@Query() query: UserProcessViewDto): Promise<UserProcessViewResponse> {
    const process = await this.processRepository.findByIdWithParticipantsAndStepsOrFail(query.processId);

    return new UserProcessViewResponse(process);
  }

  @MyApiOperation({
    rights: {
      process: {
        participant: true,
      },
    },
  })
  @Get('/my-steps')
  async getMySteps(
    @Query() query: UserProcessMyStepsDto,
    @ReqUser() user: UserEntity,
  ): Promise<UserProcessMyStepsResponse> {
    const steps = await this.stepUsersService.getActualStepsForParticipant({
      processId: query.processId,
      userId: user.id,
    });
    return new UserProcessMyStepsResponse(steps);
  }

  @MyApiOperation({
    rights: {
      process: {
        participant: true,
      },
      step: {
        participant: true,
      },
    },
  })
  @Get('/step/schema')
  async getStepSchema(@Query() query: UserProcessStepSchemaDto): Promise<UserProcessStepSchemaResponse> {
    const stepWithSchema = await this.stepRepository.findViewByIdOrFail(query.stepId);
    return new UserProcessStepSchemaResponse(stepWithSchema.formSchema);
  }

  @MyApiOperation({
    rights: {
      process: {
        participant: true,
      },
      step: {
        participant: true,
      },
    },
  })
  @Get('/step/filled-form')
  async getStepFilledForm(
    @Query() query: UserProcessStepFormFilledDto,
    @ReqUser() user: UserEntity,
  ): Promise<UserProcessStepFormFilledResponse> {
    const stepParticipants = await this.stepParticipantsRepository.findWithReactionAndFormOrFail({
      userId: user.id,
      stepId: query.stepId,
      processId: query.processId,
    });
    return new UserProcessStepFormFilledResponse(stepParticipants.filledForm);
  }

  @MyApiOperation({
    rights: {
      process: {
        participant: true,
      },
      step: {
        participant: true,
      },
    },
  })
  @Get('/step/reaction/info')
  async getStepReactionInfo(
    @Query() query: UserProcessStepReactionDto,
    @ReqUser() user: UserEntity,
  ): Promise<UserProcessStepReactionResponse> {
    const stepParticipants = await this.stepParticipantsRepository.findWithReactionAndFormOrFail({
      userId: user.id,
      stepId: query.stepId,
      processId: query.processId,
    });
    return new UserProcessStepReactionResponse(stepParticipants);
  }

  @MyApiOperation({
    rights: {
      process: {
        participant: true,
      },
      step: {
        participant: true,
      },
    },
  })
  @Get('/step/reaction/schema')
  async getStepReactionSchema(
    @Query() query: UserProcessStepReactionSchemaDto,
  ): Promise<UserProcessStepReactionSchemaResponse> {
    // валидация что схема принадлежит этапу процесса
    await this.stepRepository.findByProcessAndFormSchemaIdOrFail({
      processId: query.processId,
      formSchemaId: query.reactionSchemaId,
      stepId: query.stepId,
    });
    const res = await this.formSchemaRepository.findByIdOrFail(query.reactionSchemaId);
    return new UserProcessStepReactionSchemaResponse(res);
  }

  @MyApiOperation({
    rights: {
      process: {
        participant: true,
      },
      step: {
        participant: true,
      },
    },
  })
  @Get('/step/reaction/filled')
  async getStepReactionFilled(
    @Query() query: UserProcessStepReactionSchemaFilledDto,
    @ReqUser() user: UserEntity,
  ): Promise<UserProcessStepReactionSchemaFilledResponse> {
    const res = await this.reactionRepository.findOneByUserStepProcessOrFail({
      stepId: query.stepId,
      processId: query.processId,
      userId: user.id,
    });
    return new UserProcessStepReactionSchemaFilledResponse(res.reactionFormFilled);
  }

  @MyApiOperation({
    rights: {
      process: {
        participant: true,
      },
      step: {
        participant: true,
      },
    },
  })
  @Post('/step/apply')
  async stepApply(@Body() body: UserProcessStepApplyDto, @ReqUser() user: UserEntity) {
    await this.stepUsersService.stepApply({
      processId: body.processId,
      stepId: body.stepId,
      formSchemaId: body.formSchemaId,
      filledForm: body.filledForm,
      user,
    });
  }
}
