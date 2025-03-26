import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { ProcessUsersTypeEnum } from '@domain/process/enums/process-users-type.enum';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByIdForAuth(id: number): Promise<UserEntity | null> {
    return this.repo.createQueryBuilder('user').where('user.id = :id', { id }).getOne();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .innerJoinAndSelect('user.password', 'password')
      .withDeleted()
      .getOne();
  }

  async findByEmailWithPasswordDataOrFail(email: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Incorrect email or password');
    }
    return user;
  }

  async saveWithPasswordTransaction(user: UserEntity): Promise<UserEntity> {
    const qr = this.repo.manager.connection.createQueryRunner();
    await qr.startTransaction();
    try {
      const savedUser = await qr.manager.save(user);
      const passwordData = user.password;
      passwordData.user = savedUser;
      savedUser.password = await qr.manager.save(passwordData);
      await qr.commitTransaction();
      return savedUser;
    } catch (error) {
      await qr.rollbackTransaction();
      throw new Error(error);
    } finally {
      await qr.release();
    }
  }

  async saveSeveralWithPasswordTransaction(users: UserEntity[]): Promise<UserEntity[]> {
    const qr = this.repo.manager.connection.createQueryRunner();
    await qr.startTransaction();
    try {
      for (const user of users) {
        const savedUser = await qr.manager.save(user);
        const passwordData = user.password;
        passwordData.user = savedUser;
        savedUser.password = await qr.manager.save(passwordData);
      }

      await qr.commitTransaction();
      return users;
    } catch (error) {
      await qr.rollbackTransaction();
      throw new Error(error);
    } finally {
      await qr.release();
    }
  }

  async findByEmails(emails: string[]): Promise<UserEntity[]> {
    return this.repo.createQueryBuilder('user').where('user.email IN (:...emails)', { emails }).withDeleted().getMany();
  }

  async getAllForProcess(dto: {
    limit: number;
    offset: number;
    processId?: string;
    role?: ProcessUserRoleEnum;
    userType?: ProcessUsersTypeEnum;
    stepId?: number;
    invited?: boolean;
    nameFilter?: string;
    surnameFilter?: string;
    patronymicFilter?: string;
    emailFilter?: string;
    departmentFilter?: string;
    groupFilter?: string;
    specialtyFilter?: string;
    positionFilter?: string;
    categoryFilter?: string;
  }) {
    const qb = this.repo.createQueryBuilder('user');

    if (dto.role) {
      switch (dto.role) {
        case ProcessUserRoleEnum.expert:
          qb.innerJoinAndSelect('user.stepExperts', 'stepExperts');
          qb.innerJoinAndSelect('stepExperts.step', 'step');
          qb.innerJoinAndSelect('step.process', 'process');
          qb.where('step.id = :stepId', { stepId: dto.stepId });
          qb.andWhere('process.id = :processId', { processId: dto.processId });
          break;
        case ProcessUserRoleEnum.manager:
          qb.innerJoinAndSelect('user.processManagers', 'processManagers');
          qb.innerJoinAndSelect('processManagers.process', 'process');
          qb.where('process.id = :processId', { processId: dto.processId });
          break;
        case ProcessUserRoleEnum.participant:
          qb.innerJoinAndSelect('user.processParticipants', 'processParticipants');
          qb.innerJoinAndSelect('processParticipants.process', 'process');
          qb.where('process.id = :processId', { processId: dto.processId });
          break;
      }
    }

    if (dto.userType) {
      switch (dto.userType) {
        case ProcessUsersTypeEnum.all:
          break;
        case ProcessUsersTypeEnum.external:
          qb.where('user.etuId IS NULL');
          break;
        case ProcessUsersTypeEnum.students:
          qb.innerJoinAndSelect('user.educations', 'education');
          qb.innerJoinAndSelect('education.group', 'group');
          qb.innerJoinAndSelect('group.specialty', 'specialty');
          qb.innerJoinAndSelect('group.department', 'department');
          qb.where('user.etuId IS NOT NULL');

          if (dto.groupFilter) {
            qb.andWhere('group.title ILIKE :groupTitle', { groupTitle: `%${dto.groupFilter}%` });
          }

          //todo фильтр по специальности

          break;
        case ProcessUsersTypeEnum.workers:
          qb.innerJoinAndSelect('user.userDepartments', 'userDepartments');
          qb.innerJoinAndSelect('userDepartments.department', 'department');
          qb.innerJoinAndSelect('userDepartments.position', 'position');
          qb.innerJoinAndSelect('userDepartments.category', 'category');
          qb.where('user.etuId IS NOT NULL');

          if (dto.departmentFilter) {
            qb.andWhere('department.title ILIKE :depTitle', { depTitle: `%${dto.departmentFilter}%` });
          }

          if (dto.positionFilter) {
            qb.andWhere('position.title ILIKE :posTitle', { posTitle: `%${dto.positionFilter}%` });
          }

          if (dto.categoryFilter) {
            qb.andWhere('category.title ILIKE :catTitle', { catTitle: `%${dto.categoryFilter}%` });
          }

          break;
      }
    }

    if (dto.invited) {
      qb.where('user.status = :status', { status: UserStatusEnum.invited });
    }

    if (dto.nameFilter) {
      qb.andWhere('user.name ILIKE :nameFilter', { nameFilter: `%${dto.nameFilter}%` });
    }

    if (dto.surnameFilter) {
      qb.andWhere('user.surname ILIKE :surnameFilter', { surnameFilter: `%${dto.surnameFilter}%` });
    }

    if (dto.patronymicFilter) {
      qb.andWhere('user.patronymic ILIKE :patronymicFilter', { patronymicFilter: `%${dto.patronymicFilter}%` });
    }

    if (dto.emailFilter) {
      qb.andWhere('user.email ILIKE :emailFilter', { emailFilter: `%${dto.emailFilter}%` });
    }

    return qb.offset(dto.offset).limit(dto.limit).getManyAndCount();
  }
}
