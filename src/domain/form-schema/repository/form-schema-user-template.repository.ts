import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';
import { Repository } from 'typeorm';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { UserEntity } from '@domain/user/entities/user.entity';

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

  async getAllForUser(dto: {
    user: UserEntity;
    type: SchemaType;
    limit: number;
    offset: number;
    title?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const query = this.repo
      .createQueryBuilder('form_schema_user_template')
      .innerJoinAndSelect('form_schema_user_template.schema', 'schema')
      .where('form_schema_user_template.user_id = :userId', { userId: dto.user.id })
      .andWhere('form_schema_user_template.type = :type', { type: dto.type })
      .limit(dto.limit)
      .offset(dto.offset);

    if (dto.title) {
      query.andWhere('schema.title ILIKE :title', { title: `%${dto.title}%` });
    }

    if (dto.createdAt) {
      query.andWhere('schema.created_at::date = :createdAt', { createdAt: dto.createdAt });
    }

    if (dto.updatedAt) {
      query.andWhere('schema.updated_at::date = :updatedAt', { updatedAt: dto.updatedAt });
    }

    return query.getManyAndCount();
  }
}
