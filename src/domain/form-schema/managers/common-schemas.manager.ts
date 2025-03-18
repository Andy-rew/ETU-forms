import { Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';

@Injectable()
export class CommonSchemasManager {
  create(dto: { user: UserEntity; title: string; type: SchemaType; schema: any }) {
    const userTemplateSchema = new FormSchemaUserTemplateEntity();

    const formSchema = new FormSchemaEntity();
    formSchema.title = dto.title;
    formSchema.schema = dto.schema;

    userTemplateSchema.type = dto.type;
    userTemplateSchema.user = dto.user;
    userTemplateSchema.schema = formSchema;

    return userTemplateSchema;
  }
}
