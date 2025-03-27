import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import { ProcessAdminProcessDeleteDto } from '@applications/http/process-admin/process/request/process-admin-process-delete.dto';
import { ProcessAdminProcessCreateDto } from '@applications/http/process-admin/process/request/process-admin-process-create.dto';
import { ReqUser } from '@applications/decorators/req-user.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { FileRepository } from '@domain/file/repository/file.repository';
import { ProcessAdminProcessCreateResponse } from '@applications/http/process-admin/process/response/process-admin-process-create.response';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { ProcessAdminProcessViewDto } from '@applications/http/process-admin/process/request/process-admin-process-view.dto';
import { ProcessAdminProcessViewResponse } from '@applications/http/process-admin/process/response/process-admin-process-view.response';
import { ProcessAdminProcessEditDto } from '@applications/http/process-admin/process/request/process-admin-process-edit.dto';
import { ProcessAdminProcessUsersAddDto } from '@applications/http/process-admin/process/request/process-admin-process-users-add.dto';
import { ProcessUsersService } from '@domain/process/services/process-users.service';
import { MyApiOperation } from '@applications/decorators/my-api-operation.decorator';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { ProcessStatusService } from '@domain/process/services/process-status.service';
import { ProcessAdminProcessUsersGetAllDto } from '@applications/http/process-admin/process/request/process-admin-process-users-get-all.dto';
import { ProcessAdminProcessUsersGetAllResponse } from '@applications/http/process-admin/process/response/process-admin-process-users-get-all.response';
import { UserRepository } from '@domain/user/repository/user.repository';
import { ProcessAdminProcessStatusChangeDto } from '@applications/http/process-admin/process/request/process-admin-process-status-change.dto';
import { ProcessAdminProcessFormTemplateViewDto } from '@applications/http/process-admin/process/request/process-admin-process-form-template-view.dto';
import { FormSchemaRepository } from '@domain/form-schema/repository/form-schema.repository';
import { ProcessAdminProcessFormTemplateViewResponse } from '@applications/http/process-admin/process/response/process-admin-process-form-template-view.response';
import { StepRepository } from '@domain/step/repository/step.repository';
import { ProcessAdminProcessFormFilledViewDto } from '@applications/http/process-admin/process/request/process-admin-process-form-filled-view.dto';
import { ProcessAdminProcessFormFilledViewResponse } from '@applications/http/process-admin/process/response/process-admin-process-form-filled-view.response';
import { FormSchemaFilledRepository } from '@domain/form-schema/repository/form-schema-filled.repository';

@Controller('process-admin/process')
export class ProcessAdminProcessController {
  constructor(
    private readonly commonProcessService: CommonProcessService,
    private readonly fileRepository: FileRepository,
    private readonly processRepository: ProcessRepository,
    private readonly userRepository: UserRepository,
    private readonly processUsersService: ProcessUsersService,
    private readonly processStatusService: ProcessStatusService,
    private readonly formSchemaRepository: FormSchemaRepository,
    private readonly stepRepository: StepRepository,
    private readonly formSchemaFilledRepository: FormSchemaFilledRepository,
  ) {}

  @MyApiOperation({
    roles: [UserRoleEnum.processAdmin],
  })
  @Post('/delete')
  async deleteProcess(@Body() body: ProcessAdminProcessDeleteDto) {
    await this.commonProcessService.delete(body.processId);
  }

  @MyApiOperation({
    roles: [UserRoleEnum.processAdmin],
  })
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

  @MyApiOperation({
    rights: {
      process: {
        manager: true,
      },
    },
  })
  @Get('/view')
  async viewProcess(@Query() query: ProcessAdminProcessViewDto) {
    const res = await this.processRepository.findByIdOrFail(query.processId);
    await this.processStatusService.resolveStatus([res]);

    return new ProcessAdminProcessViewResponse(res);
  }

  @MyApiOperation({
    rights: {
      process: {
        manager: true,
      },
    },
  })
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

  @MyApiOperation({
    rights: {
      process: {
        manager: true,
      },
    },
  })
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

  @MyApiOperation({
    rights: {
      process: {
        manager: true,
      },
    },
  })
  @Get('/users/all')
  async getAllProcessUsers(
    @Query() query: ProcessAdminProcessUsersGetAllDto,
  ): Promise<ProcessAdminProcessUsersGetAllResponse> {
    const [res, count] = await this.userRepository.getAllForProcess({
      role: query.role,
      userType: query.userType,
      limit: query.limit,
      offset: query.offset,
      processId: query.processId,
      stepId: query.stepId,
      userStatus: query.userStatus,
      nameFilter: query.nameFilter,
      surnameFilter: query.surnameFilter,
      patronymicFilter: query.patronymicFilter,
      emailFilter: query.emailFilter,
      departmentFilter: query.departmentFilter,
      groupFilter: query.groupFilter,
      specialtyFilter: query.specialtyFilter,
      positionFilter: query.positionFilter,
      categoryFilter: query.categoryFilter,
    });

    return new ProcessAdminProcessUsersGetAllResponse(res, count);
  }

  @MyApiOperation({
    rights: {
      process: {
        manager: true,
      },
    },
  })
  @Post('/status/change')
  async changeStatus(@Body() body: ProcessAdminProcessStatusChangeDto): Promise<void> {
    await this.commonProcessService.changeStatus({ processId: body.processId, status: body.status });
  }

  @MyApiOperation({
    rights: {
      process: {
        manager: true,
      },
    },
  })
  @Get('/form-schema')
  async getProcessFormSchema(@Query() query: ProcessAdminProcessFormTemplateViewDto) {
    // валидация что схема принадлежит процессу
    await this.stepRepository.findByProcessAndFormSchemaIdOrFail({
      processId: query.processId,
      formSchemaId: query.formSchemaId,
    });
    const res = await this.formSchemaRepository.findByIdOrFail(query.formSchemaId);
    return new ProcessAdminProcessFormTemplateViewResponse(res);
  }

  @MyApiOperation({
    rights: {
      process: {
        manager: true,
      },
    },
  })
  @Get('/form-filled')
  async getProcessFormSchemaFilled(
    @Query() query: ProcessAdminProcessFormFilledViewDto,
  ): Promise<ProcessAdminProcessFormFilledViewResponse> {
    // валидация что схема принадлежит процессу
    await this.stepRepository.findByProcessAndFormSchemaIdOrFail({
      processId: query.processId,
      formSchemaId: query.formSchemaId,
    });

    const res = await this.formSchemaFilledRepository.findByIdAndSchemaIdOrFail({
      schemaId: query.formSchemaId,
      filledFormId: query.filledFormId,
    });
    return new ProcessAdminProcessFormFilledViewResponse(res);
  }
}
