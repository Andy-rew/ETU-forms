import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import { AuthRoles } from '@applications/decorators/auth-roles.decorator';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { ProcessAccess } from '@applications/decorators/process-access.decorator';
import { ProcessAdminProcessDeleteDto } from '@applications/http/process-admin/process/request/process-admin-process-delete.dto';
import { ProcessAdminProcessCreateDto } from '@applications/http/process-admin/process/request/process-admin-process-create.dto';
import { ReqUser } from '@applications/decorators/req-user.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { FileRepository } from '@domain/file/repository/file.repository';
import { ProcessAdminProcessCreateResponse } from '@applications/http/process-admin/process/response/process-admin-process-create.response';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { ProcessAdminProcessViewDto } from '@applications/http/process-admin/process/request/process-admin-process-view.dto';
import { ProcessAdminProcessViewResponse } from '@applications/http/process-admin/process/response/process-admin-process-view.response';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { ProcessAdminProcessEditDto } from '@applications/http/process-admin/process/request/process-admin-process-edit.dto';
import { ProcessAdminProcessUsersAddDto } from '@applications/http/process-admin/process/request/process-admin-process-users-add.dto';
import { ProcessUsersService } from '@domain/process/services/process-users.service';

@Controller('process-admin/process')
export class ProcessAdminProcessController {
  constructor(
    private readonly commonProcessService: CommonProcessService,
    private readonly fileRepository: FileRepository,
    private readonly processRepository: ProcessRepository,
    private readonly processUsersService: ProcessUsersService,
  ) {}

  @AuthRoles(UserRoleEnum.processAdmin)
  @Post('/delete')
  async deleteProcess(@Body() body: ProcessAdminProcessDeleteDto) {
    await this.commonProcessService.delete(body.processId);
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

  @ProcessAccess(ProcessUserRoleEnum.manager)
  @Get('/view')
  async viewProcess(@Query() query: ProcessAdminProcessViewDto) {
    const res = await this.processRepository.findByIdOrFail(query.processId);

    return new ProcessAdminProcessViewResponse(res);
  }

  @ProcessAccess(ProcessUserRoleEnum.manager)
  @Post('/edit')
  async editProcess(@Body() body: ProcessAdminProcessEditDto) {
    let images = null;

    if (body.imageIds) {
      images = await this.fileRepository.findByIdsOrFail(body.imageIds);
    }

    await this.commonProcessService.update({
      id: body.processId,
      title: body.title,
      startDate: body.startDate,
      endDate: body.endDate,
      description: body.description,
      images: images,
    });
  }

  @Post('/users/add')
  async addUsers(@Body() body: ProcessAdminProcessUsersAddDto, @ReqUser() user: UserEntity) {
    await this.processUsersService.addUsersToProcess({
      processId: body.processId,
      userType: body.userType,
      emails: body.emails,
      stepId: body.stepId,
      currentUser: user,
    });
  }
}
