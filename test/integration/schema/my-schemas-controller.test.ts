import { suite, test } from 'object-oriented-tests-jest';
import { BaseTestClass } from '../../BaseTest';
import * as fs from 'node:fs/promises';
import { ProcessAdminMySchemasCreateDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-create.dto';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { UserBuilder } from '../../builders/user.builder';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserEntity } from '@domain/user/entities/user.entity';
import { CommonSchemasManager } from '@domain/form-schema/managers/common-schemas.manager';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';
import { Repository } from 'typeorm';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProcessAdminMySchemasGetAllDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-get-all.dto';

@suite()
export class MySchemasControllerTest extends BaseTestClass {
  @test()
  async createSchema() {
    const file = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(file);

    const user = await this.getBuilder(UserBuilder).withAllowTemplates(true).build();

    const body: ProcessAdminMySchemasCreateDto = {
      schema: schema,
      title: 'test',
      type: SchemaType.form,
    };

    const response = await this.httpRequest()
      .withAuth(user)
      .post('/process-admin/my-schemas/create')
      .body(body)
      .execute();

    expect(response.status).toBe(201);
  }

  @test()
  async viewSchema() {
    const file = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(file);

    const user = await this.getBuilder(UserBuilder).withRoles([UserRoleEnum.user]).withAllowTemplates(true).build();

    const body: ProcessAdminMySchemasCreateDto = {
      schema: schema,
      title: 'test',
      type: SchemaType.form,
    };

    const responseCreate = await this.httpRequest()
      .withAuth(user)
      .post('/process-admin/my-schemas/create')
      .body(body)
      .execute();

    expect(responseCreate.status).toBe(201);

    const responseView = await this.httpRequest()
      .withAuth(user)
      .get('/process-admin/my-schemas/view')
      .query({ schemaId: responseCreate['body'].id })
      .execute();

    expect(responseView.status).toBe(200);
  }

  @test()
  async deleteSchema() {
    const file = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(file);

    const user = await this.getBuilder(UserBuilder).withRoles([UserRoleEnum.user]).withAllowTemplates(true).build();

    const body: ProcessAdminMySchemasCreateDto = {
      schema: schema,
      title: 'test',
      type: SchemaType.form,
    };

    const responseCreate = await this.httpRequest()
      .withAuth(user)
      .post('/process-admin/my-schemas/create')
      .body(body)
      .execute();

    expect(responseCreate.status).toBe(201);

    const responseDelete = await this.httpRequest()
      .withAuth(user)
      .post('/process-admin/my-schemas/delete')
      .body({ schemaId: responseCreate['body'].id })
      .execute();

    expect(responseDelete.status).toBe(201);
  }

  private async generateSchemasForUser(dto: { user: UserEntity; count: number }) {
    const schemas: FormSchemaUserTemplateEntity[] = [];

    const file = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schemaJson = JSON.parse(file);

    for (let i = 0; i < dto.count; i++) {
      const userSchema = this.getService(CommonSchemasManager).create({
        schema: schemaJson,
        title: `Test schema ${i}`,
        type: SchemaType.form,
        user: dto.user,
      });
      schemas.push(userSchema);
    }

    const formSchemas = schemas.map((sch) => sch.schema);
    await this.getService<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(formSchemas);

    for (let i = 0; i < schemas.length; i++) {
      schemas[i].schema = formSchemas[i];
    }

    await this.getService<Repository<FormSchemaUserTemplateEntity>>(
      getRepositoryToken(FormSchemaUserTemplateEntity),
    ).save(schemas);

    return schemas;
  }

  @test()
  async getAllSchemas() {
    const user = await this.getBuilder(UserBuilder).withRoles([UserRoleEnum.user]).withAllowTemplates(true).build();

    const schemaCount = 20;

    await this.generateSchemasForUser({ user, count: schemaCount });

    const query: ProcessAdminMySchemasGetAllDto = {
      type: SchemaType.form,
      limit: 10,
      offset: 0,
    };

    const responseGetAll = await this.httpRequest()
      .withAuth(user)
      .get('/process-admin/my-schemas/all')
      .query(query)
      .execute();

    expect(responseGetAll.status).toBe(200);
    expect(responseGetAll.body.count).toBe(schemaCount);
  }

  @test()
  async getAllSchemasTypeFilter() {
    const user = await this.getBuilder(UserBuilder).withRoles([UserRoleEnum.user]).withAllowTemplates(true).build();

    const schemaCount = 20;

    await this.generateSchemasForUser({ user, count: schemaCount });

    const query: ProcessAdminMySchemasGetAllDto = {
      type: SchemaType.accept,
      limit: 10,
      offset: 0,
    };

    const responseGetAll = await this.httpRequest()
      .withAuth(user)
      .get('/process-admin/my-schemas/all')
      .query(query)
      .execute();

    expect(responseGetAll.status).toBe(200);
    expect(responseGetAll.body.count).toBe(0);
  }

  @test()
  async getAllSchemasTitleFilter() {
    const user = await this.getBuilder(UserBuilder).withRoles([UserRoleEnum.user]).withAllowTemplates(true).build();

    const schemaCount = 20;

    await this.generateSchemasForUser({ user, count: schemaCount });

    const query: ProcessAdminMySchemasGetAllDto = {
      type: SchemaType.form,
      title: 'Test',
      limit: 10,
      offset: 0,
    };

    const responseGetAll = await this.httpRequest()
      .withAuth(user)
      .get('/process-admin/my-schemas/all')
      .query(query)
      .execute();

    expect(responseGetAll.status).toBe(200);
    expect(responseGetAll.body.count).toBe(schemaCount);
  }

  @test()
  async getAllSchemasDateFilter() {
    const user = await this.getBuilder(UserBuilder).withRoles([UserRoleEnum.user]).withAllowTemplates(true).build();

    const schemaCount = 20;

    await this.generateSchemasForUser({ user, count: schemaCount });

    const query: ProcessAdminMySchemasGetAllDto = {
      type: SchemaType.form,
      createdAt: new Date(),
      updatedAt: new Date(),
      limit: 10,
      offset: 0,
    };

    const responseGetAll = await this.httpRequest()
      .withAuth(user)
      .get('/process-admin/my-schemas/all')
      .query(query)
      .execute();

    expect(responseGetAll.status).toBe(200);
    expect(responseGetAll.body.count).toBe(schemaCount);
  }
}
describe('', () => {});
