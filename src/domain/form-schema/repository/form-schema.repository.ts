import { Injectable, NotFoundException } from '@nestjs/common';
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

  async save(schema: FormSchemaEntity): Promise<FormSchemaEntity> {
    return this.repo.save(schema);
  }

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

  async findById(id: number): Promise<FormSchemaEntity | null> {
    return this.repo.findOne({ where: { id }, relations: { userTemplate: true } });
  }

  async findByIdOrFail(id: number) {
    const schema = await this.findById(id);
    if (!schema) {
      throw new NotFoundException('Schema not found');
    }
    return schema;
  }

  async deleteUserSchemaByFormSchemaIdTransaction(id: number) {
    const qr = this.repo.manager.connection.createQueryRunner();
    await qr.startTransaction();
    try {
      await qr.manager.delete(FormSchemaUserTemplateEntity, { schema: { id } });
      await qr.manager.delete(FormSchemaEntity, { id });
      await qr.commitTransaction();
    } catch (error) {
      await qr.rollbackTransaction();
      throw new Error(error);
    } finally {
      await qr.release();
    }
  }
}
