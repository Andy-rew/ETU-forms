import { suite, test } from 'object-oriented-tests-jest';
import { BaseTestClass } from '../../BaseTest';
import * as fs from 'node:fs/promises';
import { ProcessAdminMySchemasCreateDto } from '@applications/http/process-admin/my-schemas/request/process-admin-my-schemas-create.dto';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { UserBuilder } from '../../builders/user.builder';

@suite()
export class MySchemasControllerTest extends BaseTestClass {
  @test()
  async createSchema() {
    const file = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(file);

    const user = await this.getBuilder(UserBuilder).build();

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

    await this.queryRunner.commitTransaction();
    await this.queryRunner.startTransaction();

    expect(response.status).toBe(201);
  }
}
describe('', () => {});
