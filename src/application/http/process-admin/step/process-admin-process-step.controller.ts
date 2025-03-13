import { Body, Controller, Post } from '@nestjs/common';
import { ProcessAdminCreateProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-create-process-step.dto';
import { CommonStepService } from '@domain/step/services/common-step.service';
import { ProcessAdminCreateProcessStepResponse } from '@applications/http/process-admin/step/response/process-admin-create-process-step.response';
import { ProcessAccess } from '@applications/decorators/process-access.decorator';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';

@ProcessAccess(ProcessUserRoleEnum.manager)
@Controller('process-admin/process/steps')
export class ProcessAdminProcessStepController {
  constructor(private readonly commonStepService: CommonStepService) {}

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
}
