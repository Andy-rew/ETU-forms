import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';

@Entity('form_schema_filled')
export class FormSchemaFilledEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => FormSchemaEntity, (schema: FormSchemaEntity) => schema.filledForms, { nullable: false })
  schema: FormSchemaEntity;
}
