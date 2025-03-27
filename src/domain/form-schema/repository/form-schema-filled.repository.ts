import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FormSchemaFilledRepository {
  constructor(@InjectRepository(FormSchemaFilledEntity) private readonly repo: Repository<FormSchemaFilledEntity>) {}

  async findByIdAndSchemaId(dto: { schemaId: number; filledFormId: number }): Promise<FormSchemaFilledEntity | null> {
    return this.repo
      .createQueryBuilder('filledForm')
      .innerJoinAndSelect('filledForm.schema', 'schema')
      .where('filledForm.id = :filledFormId', { filledFormId: dto.filledFormId })
      .andWhere('schema.id = :schemaId', { schemaId: dto.schemaId })
      .getOne();
  }

  async findByIdAndSchemaIdOrFail(dto: { schemaId: number; filledFormId: number }) {
    const formSchemaFilled = await this.findByIdAndSchemaId(dto);
    if (!formSchemaFilled) {
      throw new NotFoundException('Filled form schema not found');
    }
    return formSchemaFilled;
  }
}
