import { Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { CommonSchemasManager } from '@domain/form-schema/managers/common-schemas.manager';
import { FormSchemaRepository } from '@domain/form-schema/repository/form-schema.repository';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';

@Injectable()
export class CommonSchemasService {
  constructor(
    private readonly commonSchemasManager: CommonSchemasManager,
    private readonly formSchemaRepository: FormSchemaRepository,
  ) {}

  async createUserSchema(dto: {
    user: UserEntity;
    title: string;
    type: SchemaType;
    schema: any;
  }): Promise<FormSchemaUserTemplateEntity> {
    const schema = this.commonSchemasManager.create(dto);

    return this.formSchemaRepository.createUserFormSchemaTransaction(schema);
  }
}
