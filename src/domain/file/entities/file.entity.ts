import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';
import { ProcessEntity } from '@domain/process/entities/process.entity';

@Entity('files')
export class FileEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(
    () => ProcessEntity,
    (process: ProcessEntity) => process.processImages,
  )
  processes: ProcessEntity[];
}
