import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { CommonSchemasManager } from '@domain/form-schema/managers/common-schemas.manager';
import { FormSchemaRepository } from '@domain/form-schema/repository/form-schema.repository';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';
import { SurveySchemaType } from '@domain/form-schema/type/survey-schema.type';
import { StepRepository } from '@domain/step/repository/step.repository';

@Injectable()
export class CommonSchemasService {
  constructor(
    private readonly commonSchemasManager: CommonSchemasManager,
    private readonly formSchemaRepository: FormSchemaRepository,
    private readonly stepRepository: StepRepository,
  ) {}

  async createUserSchema(dto: {
    user: UserEntity;
    title: string;
    type: SchemaType;
    schema: SurveySchemaType;
  }): Promise<FormSchemaUserTemplateEntity> {
    const schema = this.commonSchemasManager.create(dto);

    return this.formSchemaRepository.createUserFormSchemaTransaction(schema);
  }

  async deleteUserSchemaByFormSchemaId(formSchemaId: number): Promise<void> {
    const stepWithFormSchema = await this.stepRepository.findOneByFormSchemaId(formSchemaId);
    if (stepWithFormSchema) {
      throw new BadRequestException(`Schema in use in step with id= ${stepWithFormSchema.id}`);
    }

    return this.formSchemaRepository.deleteUserSchemaByFormSchemaIdTransaction(formSchemaId);
  }
}
