import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { FormSchemaUserTemplateEntity } from '@domain/form-schema/entities/form-schema-user-template.entity';

@Entity('form_schemas')
export class FormSchemaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  schema: JSON;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FormSchemaFilledEntity, (filledForm: FormSchemaFilledEntity) => filledForm.schema)
  filledForms: FormSchemaFilledEntity[];

  @OneToOne(() => FormSchemaUserTemplateEntity, (userTemplate: FormSchemaUserTemplateEntity) => userTemplate.schema)
  userTemplate: FormSchemaUserTemplateEntity;
}