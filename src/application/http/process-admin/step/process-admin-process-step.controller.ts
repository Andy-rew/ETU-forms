import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProcessAdminCreateProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-create-process-step.dto';
import { CommonStepService } from '@domain/step/services/common-step.service';
import { ProcessAdminCreateProcessStepResponse } from '@applications/http/process-admin/step/response/process-admin-create-process-step.response';
import { ProcessAdminGetAllProcessStepsResponse } from '@applications/http/process-admin/step/response/process-admin-get-all-process-steps.response';
import { ProcessAdminGetAllProcessStepsDto } from '@applications/http/process-admin/step/request/process-admin-get-all-process-steps.dto';
import { ProcessAdminViewProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-view-process-step.dto';
import { ProcessAdminViewProcessStepResponse } from '@applications/http/process-admin/step/response/process-admin-view-process-step.response';
import { StepRepository } from '@domain/step/repository/step.repository';
import { MyApiOperation } from '@applications/decorators/my-api-operation.decorator';
import { ProcessAdminUpdateProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-update-process-step.dto';
import { ProcessAdminUpdateProcessStepSchemaDto } from '@applications/http/process-admin/step/request/process-admin-update-process-step-schema.dto';

@MyApiOperation({
  rights: {
    process: {
      manager: true,
    },
  },
})
@Controller('process-admin/process/steps')
export class ProcessAdminProcessStepController {
  constructor(private readonly commonStepService: CommonStepService, private readonly stepRepository: StepRepository) {}

  @Post('/create')
  async create(@Body() body: ProcessAdminCreateProcessStepDto) {
    const res = await this.commonStepService.create({
      processId: body.processId,
      title: body.title,
      startTime: body.startTime,
      endTime: body.endTime,
      participantsCount: body.participantsCount,
      parentId: body.parentId,
    });
    return new ProcessAdminCreateProcessStepResponse(res);
  }

  @Get('/all')
  async getAl(@Query() query: ProcessAdminGetAllProcessStepsDto): Promise<ProcessAdminGetAllProcessStepsResponse> {
    const res = await this.stepRepository.findAllByProcess(query.processId);
    return new ProcessAdminGetAllProcessStepsResponse(res);
  }

  @Get('/view')
  async getOne(@Query() query: ProcessAdminViewProcessStepDto): Promise<ProcessAdminViewProcessStepResponse> {
    const res = await this.stepRepository.findViewByIdOrFail(query.stepId);
    return new ProcessAdminViewProcessStepResponse(res);
  }

  @Post('/edit')
  async edit(@Body() body: ProcessAdminUpdateProcessStepDto) {
    await this.commonStepService.edit({
      processId: body.processId,
      stepId: body.stepId,
      title: body.title,
      startTime: body.startTime,
      endTime: body.endTime,
      participantsCount: body.participantsCount,
    });
  }

  @MyApiOperation({
    rights: {
      schema: {
        mySchemas: true,
      },
    },
  })
  @Post('/edit/schema')
  async editSchema(@Body() body: ProcessAdminUpdateProcessStepSchemaDto) {
    await this.commonStepService.editSchema({
      processId: body.processId,
      stepId: body.stepId,
      type: body.type,
      schemaId: body.schemaId,
    });
  }
}
