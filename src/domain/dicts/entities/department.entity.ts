import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FacultyEntity } from '@domain/dicts/entities/faculty.entity';

@Entity('departments')
export class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  shortTitle: string;

  @Column()
  lkId: number;

  @ManyToOne(() => FacultyEntity, (faculty: FacultyEntity) => faculty.departments, { nullable: false })
  faculty: FacultyEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
