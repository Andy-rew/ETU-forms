import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import { IsEnum } from 'class-validator';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { UserEntity } from '@domain/user/entities/user.entity';

@Entity('form_schema_user_templates')
export class FormSchemaUserTemplateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SchemaType, default: SchemaType.form })
  @IsEnum(SchemaType)
  type: SchemaType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => FormSchemaEntity, (schema: FormSchemaEntity) => schema.userTemplate, { nullable: false })
  @JoinColumn({ name: 'schema_id' })
  schema: FormSchemaEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.schemaTemplates, { nullable: false })
  user: UserEntity;
}
