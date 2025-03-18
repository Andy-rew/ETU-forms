import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { Repository } from 'typeorm';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';

@Injectable()
export class FormSchemaRepository {
  constructor(
    @InjectRepository(FormSchemaEntity)
    private readonly repo: Repository<FormSchemaEntity>,
  ) {}

  async createUserFormSchemaTransaction(
    userFormSchema: FormSchemaUserTemplateEntity,
  ): Promise<FormSchemaUserTemplateEntity> {
    const qr = this.repo.manager.connection.createQueryRunner();
    await qr.startTransaction();
    try {
      await qr.manager.save(userFormSchema.schema);
      const schema = await qr.manager.save(userFormSchema);

      await qr.commitTransaction();
      return schema;
    } catch (error) {
      await qr.rollbackTransaction();
      throw new Error(error);
    } finally {
      await qr.release();
    }
  }
}
