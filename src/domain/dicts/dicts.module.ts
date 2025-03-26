import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '@domain/dicts/entities/category.entity';
import { DepartmentEntity } from '@domain/dicts/entities/department.entity';
import { FacultyEntity } from '@domain/dicts/entities/faculty.entity';
import { GroupEntity } from '@domain/dicts/entities/group.entity';
import { SpecialtyEntity } from '@domain/dicts/entities/specialty.entity';
import { WorkPositionsEntity } from '@domain/dicts/entities/work-positions.entity';
import { WorkPositionRepository } from '@domain/dicts/repository/work-position.repository';
import { CategoryRepository } from '@domain/dicts/repository/category.repository';
import { DepartmentRepository } from '@domain/dicts/repository/department.repository';
import { FacultyRepository } from '@domain/dicts/repository/faculty.repository';
import { GroupRepository } from '@domain/dicts/repository/group.repository';
import { SpecialtyRepository } from '@domain/dicts/repository/specialty.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      DepartmentEntity,
      FacultyEntity,
      GroupEntity,
      SpecialtyEntity,
      WorkPositionsEntity,
    ]),
  ],
  providers: [
    WorkPositionRepository,
    CategoryRepository,
    DepartmentRepository,
    FacultyRepository,
    GroupRepository,
    SpecialtyRepository,
  ],
  exports: [
    WorkPositionRepository,
    CategoryRepository,
    DepartmentRepository,
    FacultyRepository,
    GroupRepository,
    SpecialtyRepository,
  ],
})
export class DictsModule {}
