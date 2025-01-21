import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { DepartmentEntity } from '@domain/dicts/entities/department.entity';

@Entity('faculties')
export class FacultyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  shortTitle: string;

  @Column()
  lkId: number;

  @OneToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'leader_id' })
  leader: UserEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DepartmentEntity, (department: DepartmentEntity) => department.faculty)
  departments: DepartmentEntity[];
}
