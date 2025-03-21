import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FormSchemaUserTemplateRepository {
  constructor(
    @InjectRepository(FormSchemaUserTemplateEntity) private readonly repo: Repository<FormSchemaUserTemplateEntity>,
  ) {}

  async findByUserIdAndSchemaId(dto: {
    userId: number;
    schemaId: number;
  }): Promise<FormSchemaUserTemplateEntity | null> {
    return this.repo.findOne({
      where: { user: { id: dto.userId }, schema: { id: dto.schemaId } },
      relations: {
        user: true,
        schema: true,
      },
    });
  }

  async findByUserIdAndSchemaIdOrFail(dto: { userId: number; schemaId: number }) {
    const formSchemaUserTemplate = await this.findByUserIdAndSchemaId(dto);
    if (!formSchemaUserTemplate) {
      throw new NotFoundException('FormSchemaUserTemplate not found');
    }
    return formSchemaUserTemplate;
  }
}
