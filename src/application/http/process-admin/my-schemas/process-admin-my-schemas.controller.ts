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
import { ProcessAdminMySchemasGetAllDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-get-all.dto';
import { FormSchemaUserTemplateRepository } from '@domain/form-schema/repository/form-schema-user-template.repository';
import { ProcessAdminMySchemasGetAllResponse } from '@applications/http/process-admin/my-schemas/response/process-admin-my-schemas-get-all.response';
import { ProcessAdminMySchemasEditDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-edit.dto';

@Controller('process-admin/my-schemas')
export class ProcessAdminMySchemasController {
  constructor(
    private readonly commonSchemasService: CommonSchemasService,
    private readonly formSchemaRepository: FormSchemaRepository,
    private readonly formSchemaUserTemplateRepository: FormSchemaUserTemplateRepository,
  ) {}

  @MyApiOperation({
    rights: {
      schema: {
        allowTemplates: true,
      },
    },
  })
  @Post('/create')
  async createSchema(
    @Body() body: ProcessAdminMySchemasCreateDto,
    @ReqUser() user: UserEntity,
  ): Promise<ProcessAdminMySchemasCreateResponse> {
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
  async getViewSchema(@Query() query: ProcessAdminMySchemasGetViewDto): Promise<ProcessAdminMySchemasGetViewResponse> {
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
  async deleteSchema(@Body() body: ProcessAdminMySchemasDeleteDto): Promise<void> {
    await this.commonSchemasService.deleteUserSchemaByFormSchemaId(body.schemaId);
  }

  @MyApiOperation({
    rights: {
      schema: {
        mySchemas: true,
      },
    },
  })
  @Post('/edit')
  async editSchema(@Body() body: ProcessAdminMySchemasEditDto): Promise<void> {
    await this.commonSchemasService.editUserSchema({
      schemaId: body.schemaId,
      title: body.title,
      schema: body.schema,
    });
  }

  @MyApiOperation({
    rights: {
      schema: {
        allowTemplates: true,
      },
    },
  })
  @Get('/all')
  async getAll(
    @Query() query: ProcessAdminMySchemasGetAllDto,
    @ReqUser() user: UserEntity,
  ): Promise<ProcessAdminMySchemasGetAllResponse> {
    const [res, count] = await this.formSchemaUserTemplateRepository.getAllForUser({
      user,
      type: query.type,
      limit: query.limit,
      offset: query.offset,
      title: query.title,
      createdAt: query.createdAt,
      updatedAt: query.updatedAt,
    });

    return new ProcessAdminMySchemasGetAllResponse(count, res);
  }
}
