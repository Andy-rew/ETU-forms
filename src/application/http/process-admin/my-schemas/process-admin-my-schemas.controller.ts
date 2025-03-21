import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProcessAdminMySchemasCreateDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-create.dto';
import { AuthRoles } from '@applications/decorators/auth-roles.decorator';
import { CommonSchemasService } from '@domain/form-schema/service/common-schemas.service';
import { ReqUser } from '@applications/decorators/req-user.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessAdminMySchemasCreateResponse } from '@applications/http/process-admin/my-schemas/response/process-admin-my-schemas-create.response';
import { SchemaManage } from '@applications/decorators/schemas-manage.decorator';
import { ProcessAdminMySchemasGetViewDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-get-view.dto';
import { FormSchemaRepository } from '@domain/form-schema/repository/form-schema.repository';
import { ProcessAdminMySchemasGetViewResponse } from '@applications/http/process-admin/my-schemas/response/process-admin-my-schemas-get-view.response';

@SchemaManage()
@AuthRoles()
@Controller('process-admin/my-schemas')
export class ProcessAdminMySchemasController {
  constructor(
    private readonly commonSchemasService: CommonSchemasService,
    private readonly formSchemaRepository: FormSchemaRepository,
  ) {}

  @Post('/create')
  async createSchema(@Body() body: ProcessAdminMySchemasCreateDto, @ReqUser() user: UserEntity) {
    const res = await this.commonSchemasService.createUserSchema({
      user,
      title: body.title,
      type: body.type,
      schema: body.schema,
    });

    return new ProcessAdminMySchemasCreateResponse(res.schema);
  }

  @Get('/view')
  async getViewSchema(@Query() query: ProcessAdminMySchemasGetViewDto) {
    const res = await this.formSchemaRepository.findByIdOrFail(query.schemaId);

    return new ProcessAdminMySchemasGetViewResponse(res);
  }
}
