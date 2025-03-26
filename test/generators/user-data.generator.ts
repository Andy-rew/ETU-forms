import { INestApplication } from '@nestjs/common';
import { DepartmentEntity } from '@domain/dicts/entities/department.entity';
import { FacultyEntity } from '@domain/dicts/entities/faculty.entity';
import { FacultyRepository } from '@domain/dicts/repository/faculty.repository';
import { DepartmentRepository } from '@domain/dicts/repository/department.repository';
import { CategoryRepository } from '@domain/dicts/repository/category.repository';
import { CategoryEntity } from '@domain/dicts/entities/category.entity';
import { WorkPositionsEntity } from '@domain/dicts/entities/work-positions.entity';
import { WorkPositionRepository } from '@domain/dicts/repository/work-position.repository';
import { UserBuilder } from '../builders/user.builder';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserDepartmentsEntity } from '@domain/user/entities/user-departments.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialtyEntity } from '@domain/dicts/entities/specialty.entity';
import { SpecialtyRepository } from '@domain/dicts/repository/specialty.repository';
import { GroupEntity } from '@domain/dicts/entities/group.entity';
import { EducationEntity } from '@domain/user/entities/education.entity';
import { randomInt } from 'node:crypto';

export class UserDataGenerator {
  constructor(private readonly app: INestApplication) {}

  private randomVals = [];

  private randomIntVal() {
    let val = randomInt(0, 100000);

    while (this.randomVals.includes(val)) {
      val = randomInt(0, 100000);
    }

    this.randomVals.push(val);

    return val;
  }

  async generateCategories(count = 10) {
    const categories: CategoryEntity[] = [];
    for (let i = 0; i < count; i++) {
      const category = new CategoryEntity();
      category.title = `Test category ${i}`;
      category.shortTitle = `Test category ${i}`;
      category.lkId = this.randomIntVal();
      categories.push(category);
    }

    await this.app.get(CategoryRepository).saveMany(categories);

    return categories;
  }

  async generateSpecialities(count = 10) {
    const specialtyEntities: SpecialtyEntity[] = [];
    for (let i = 0; i < count; i++) {
      const specialty = new SpecialtyEntity();
      specialty.title = `Test specialty ${i}`;
      specialty.studyYears = `2024-2025`;
      specialty.lkId = this.randomIntVal();
      specialty.cipher = `09.0${i}.01`;
      specialtyEntities.push(specialty);
    }

    await this.app.get(SpecialtyRepository).saveMany(specialtyEntities);

    return specialtyEntities;
  }

  async generateWorkPositions() {
    const workPositions: WorkPositionsEntity[] = [];
    for (let i = 0; i < 10; i++) {
      const workPosition = new WorkPositionsEntity();
      workPosition.title = `Test work position ${i}`;
      workPosition.shortTitle = `Test work position ${i}`;
      workPosition.lkId = this.randomIntVal();
      workPositions.push(workPosition);
    }

    await this.app.get(WorkPositionRepository).saveMany(workPositions);

    return workPositions;
  }

  async generateDepartments(dto: { departmentsCount?: number; facultiesCount?: number }) {
    const departmentsCount = dto.departmentsCount || 20;
    const facultiesCount = dto.facultiesCount || 10;

    const faculties = [];
    for (let i = 0; i < facultiesCount; i++) {
      const faculty = new FacultyEntity();
      faculty.title = `Test faculty ${i}`;
      faculty.shortTitle = `Test faculty ${i}`;
      faculty.lkId = this.randomIntVal();
      faculties.push(faculty);
    }

    await this.app.get(FacultyRepository).saveMany(faculties);

    const departments: DepartmentEntity[] = [];

    for (let j = 0; j < facultiesCount; j++) {
      for (let i = 0; i < departmentsCount; i++) {
        const department = new DepartmentEntity();
        department.title = `Test department ${i}_${j}`;
        department.shortTitle = `Test department ${i}_${j}`;
        department.lkId = this.randomIntVal();
        department.faculty = faculties[j];
        departments.push(department);
      }
    }

    await this.app.get(DepartmentRepository).saveMany(departments);

    return departments;
  }

  async generateSomeUsers() {
    const usersWorkers = await new UserBuilder(this.app)
      .withStatus(UserStatusEnum.activated)
      .withRoles([UserRoleEnum.user])
      .withEtuId()
      .buildMany(20);

    const usersStudents = await new UserBuilder(this.app)
      .withStatus(UserStatusEnum.activated)
      .withRoles([UserRoleEnum.user])
      .withEtuId()
      .buildMany(20);

    const usersInvited = await new UserBuilder(this.app)
      .withStatus(UserStatusEnum.invited)
      .withRoles([UserRoleEnum.user])
      .buildMany(20);

    const departments = await this.generateDepartments({});
    const categories = await this.generateCategories();
    const workPositions = await this.generateWorkPositions();

    const userDeps: UserDepartmentsEntity[] = [];

    usersWorkers.forEach((worker) => {
      const userDep = new UserDepartmentsEntity();
      userDep.user = worker;
      userDep.department = departments[randomInt(200) % departments.length];
      userDep.position = workPositions[randomInt(200) % workPositions.length];
      userDep.category = categories[randomInt(200) % categories.length];
      userDeps.push(userDep);
    });

    await this.app.get<Repository<UserDepartmentsEntity>>(getRepositoryToken(UserDepartmentsEntity)).save(userDeps);

    const specialties = await this.generateSpecialities();

    const groups: GroupEntity[] = [];

    for (let i = 0; i < 20; i++) {
      const group = new GroupEntity();
      group.title = `9337${i}`;
      group.specialty = specialties[randomInt(200) % specialties.length];
      group.department = departments[randomInt(200) % departments.length];
      groups.push(group);
    }

    await this.app.get<Repository<GroupEntity>>(getRepositoryToken(GroupEntity)).save(groups);

    const educations: EducationEntity[] = [];

    usersStudents.forEach((student) => {
      const education = new EducationEntity();
      education.user = student;
      education.group = groups[randomInt(200) % groups.length];
      educations.push(education);
    });

    await this.app.get<Repository<EducationEntity>>(getRepositoryToken(EducationEntity)).save(educations);
  }
}
