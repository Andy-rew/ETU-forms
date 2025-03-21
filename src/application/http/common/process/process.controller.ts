import { Controller, Get, Query } from '@nestjs/common';
import { ProcessGetAllDto } from '@applications/http/common/process/request/process-get-all.dto';
import { ProcessGetAllResponse } from '@applications/http/common/process/response/process-get-all.response';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import { ReqUser } from '@applications/decorators/req-user.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { MyApiOperation } from '@applications/decorators/my-api-operation.decorator';

@MyApiOperation({
  anyRole: true,
})
@Controller('process')
export class ProcessController {
  constructor(private readonly commonProcessService: CommonProcessService) {}

  @Get('/all')
  async getAll(@Query() query: ProcessGetAllDto, @ReqUser() user: UserEntity): Promise<ProcessGetAllResponse> {
    const res = await this.commonProcessService.getAll({
      role: query.role,
      limit: query.limit,
      offset: query.offset,
      user,
      status: query.status,
      title: query.title,
      startDate: query.startDate,
      endDate: query.endDate,
    });

    return new ProcessGetAllResponse(res.count, res.processes);
  }
}
