import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProcessAdminMySchemasCreateDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-create.dto';
import { CommonSchemasService } from '@domain/form-schema/service/common-schemas.service';
import { ReqUser } from '@applications/decorators/req-user.decorator';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessAdminMySchemasCreateResponse } from '@applications/http/process-admin/my-schemas/response/process-admin-my-schemas-create.response';
import { ProcessAdminMySchemasGetViewDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-get-view.dto';
import { FormSchemaRepository } from '@domain/form-schema/repository/form-schema.repository';
import { ProcessAdminMySchemasGetViewResponse } from '@applications/http/process-admin/my-schemas/response/process-admin-my-schemas-get-view.response';
import { MyApiOperation } from '@applications/decorators/my-api-operation.decorator';
import { ProcessAdminMySchemasDeleteDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-delete.dto';

@Controller('process-admin/my-schemas')
export class ProcessAdminMySchemasController {
  constructor(
    private readonly commonSchemasService: CommonSchemasService,
    private readonly formSchemaRepository: FormSchemaRepository,
  ) {}

  @MyApiOperation({
    rights: {
      schema: {
        allowTemplates: true,
      },
    },
  })
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

  @MyApiOperation({
    rights: {
      schema: {
        mySchemas: true,
      },
    },
  })
  @Get('/view')
  async getViewSchema(@Query() query: ProcessAdminMySchemasGetViewDto) {
    const res = await this.formSchemaRepository.findByIdOrFail(query.schemaId);

    return new ProcessAdminMySchemasGetViewResponse(res);
  }

  @MyApiOperation({
    rights: {
      schema: {
        mySchemas: true,
      },
    },
  })
  @Post('/delete')
  async deleteSchema(@Body() body: ProcessAdminMySchemasDeleteDto) {
    const res = await this.commonSchemasService.deleteUserSchemaByFormSchemaId(body.schemaId);
  }
}
