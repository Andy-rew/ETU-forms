import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import { AuthRoles } from '@applications/decorators/auth-roles.decorator';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { ProcessManagerAccess } from '@applications/decorators/process-access.decorator';
import { ProcessAdminProcessDeleteDto } from '@applications/http/process-admin/process/request/process-admin-process-delete.dto';
import { ProcessAdminProcessCreateDto } from '@applications/http/process-admin/process/request/process-admin-process-create.dto';
import { ReqUser } from '@applications/decorators/req-user.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { FileRepository } from '@domain/file/repository/file.repository';
import { ProcessAdminProcessCreateResponse } from '@applications/http/process-admin/process/response/process-admin-process-create.response';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { ProcessAdminProcessViewDto } from '@applications/http/process-admin/process/request/process-admin-process-view.dto';
import { ProcessAdminProcessViewResponse } from '@applications/http/process-admin/process/response/process-admin-process-view.response';

@Controller('process-admin/process')
export class ProcessAdminProcessController {
  constructor(
    private readonly commonProcessService: CommonProcessService,
    private readonly fileRepository: FileRepository,
    private readonly processRepository: ProcessRepository,
  ) {}

  @AuthRoles(UserRoleEnum.processAdmin)
  @ProcessManagerAccess()
  @Post('/delete')
  async deleteProcess(@Body() body: ProcessAdminProcessDeleteDto) {
    await this.commonProcessService.delete(body.id);
  }

  @AuthRoles(UserRoleEnum.processAdmin)
  @Post('/create')
  async createProcess(@Body() body: ProcessAdminProcessCreateDto, @ReqUser() user: UserEntity) {
    let images = null;

    if (body.imageIds) {
      images = await this.fileRepository.findByIdsOrFail(body.imageIds);
    }

    const res = await this.commonProcessService.create({
      title: body.title,
      startDate: body.startDate,
      endDate: body.endDate,
      description: body.description,
      images: images,
      processAdmin: user,
    });

    return new ProcessAdminProcessCreateResponse(res);
  }

  @ProcessManagerAccess()
  @Get('/view')
  async viewProcess(@Query() query: ProcessAdminProcessViewDto) {
    const res = await this.processRepository.findByIdOrFail(query.id);

    return new ProcessAdminProcessViewResponse(res);
  }
}
