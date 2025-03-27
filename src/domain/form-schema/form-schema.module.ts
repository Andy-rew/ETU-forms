import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';
import { FormSchemaRepository } from '@domain/form-schema/repository/form-schema.repository';
import { CommonSchemasService } from '@domain/form-schema/service/common-schemas.service';
import { CommonSchemasManager } from '@domain/form-schema/managers/common-schemas.manager';
import { ProcessAdminMySchemasController } from '@applications/http/process-admin/my-schemas/process-admin-my-schemas.controller';
import { AuthJwtAccessTokenModule } from '@infrastructure/module/auth-jwt-access-token.module';
import { UserModule } from '@domain/user/user.module';
import { FormSchemaUserTemplateRepository } from '@domain/form-schema/repository/form-schema-user-template.repository';
import { StepModule } from '@domain/step/step.module';
import { FormSchemaFilledRepository } from '@domain/form-schema/repository/form-schema-filled.repository';

@Module({
  controllers: [ProcessAdminMySchemasController],
  imports: [
    TypeOrmModule.forFeature([FormSchemaEntity, FormSchemaFilledEntity, FormSchemaUserTemplateEntity]),
    AuthJwtAccessTokenModule,
    UserModule,
    forwardRef(() => StepModule),
  ],
  providers: [
    FormSchemaRepository,
    CommonSchemasService,
    CommonSchemasManager,
    FormSchemaUserTemplateRepository,
    FormSchemaFilledRepository,
  ],
  exports: [FormSchemaRepository, CommonSchemasService, FormSchemaUserTemplateRepository, FormSchemaFilledRepository],
})
export class FormSchemaModule {}
