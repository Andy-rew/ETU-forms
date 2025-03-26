import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FacultyEntity } from '@domain/dicts/entities/faculty.entity';
import { GroupEntity } from '@domain/dicts/entities/group.entity';

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

  @OneToMany(() => GroupEntity, (group: GroupEntity) => group.department)
  groups: GroupEntity[];

  @ManyToOne(() => FacultyEntity, (faculty: FacultyEntity) => faculty.departments, { nullable: false })
  faculty: FacultyEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
