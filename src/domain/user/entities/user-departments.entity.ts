import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DepartmentEntity } from '@domain/dicts/entities/department.entity';
import { UserEntity } from '@domain/user/entities/user.entity';
import { WorkPositionsEntity } from '@domain/dicts/entities/work-positions.entity';
import { CategoryEntity } from '@domain/dicts/entities/category.entity';

@Entity('user_departments')
export class UserDepartmentsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DepartmentEntity, { nullable: false })
  department: DepartmentEntity;

  @ManyToOne(() => WorkPositionsEntity, { nullable: false })
  position: WorkPositionsEntity;

  @ManyToOne(() => CategoryEntity, { nullable: false })
  category: CategoryEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userDepartments, { nullable: false })
  user: UserEntity;
}
