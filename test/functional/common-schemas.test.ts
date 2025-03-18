import { suite, test } from 'object-oriented-tests-jest';
import { BaseTestClass } from '../BaseTest';
import * as fs from 'node:fs/promises';
import { UserBuilder } from '../builders/user.builder';
import { CommonSchemasService } from '@domain/form-schema/service/common-schemas.service';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';

@suite()
export class CommonSchemasTest extends BaseTestClass {
  @test()
  async createMySchemaSuccess() {
    const file = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(file);

    const user = await this.getBuilder(UserBuilder).build();

    const userSchemaTemplate = await this.getService(CommonSchemasService).createUserSchema({
      user,
      schema,
      type: SchemaType.form,
      title: 'test',
    });

    expect(userSchemaTemplate.id).toBeDefined();
    expect(userSchemaTemplate.schema.id).toBeDefined();
  }
}
describe('', () => {});
