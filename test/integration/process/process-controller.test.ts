import { BaseTestClass } from '../../BaseTest';
import { suite, test } from 'object-oriented-tests-jest';
import { UserBuilder } from '../../builders/user.builder';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { ProcessBuilder } from '../../builders/process.builder';
import { ProcessGetAllDto } from '@applications/http/common/process/request/process-get-all.dto';
import { ProcessGetAllByRoleEnum } from '@domain/process/enums/process-get-all-by-role.enum';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { Repository } from 'typeorm';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProcessManagersEntity } from '@domain/process/entities/process-managers.entity';
import { StepEntity } from '@domain/step/entities/step.entity';
import { StepBuilder } from '../../builders/step.builder';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';
import * as dayjs from 'dayjs';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import * as timekeeper from 'timekeeper';

@suite()
export class ProcessControllerTest extends BaseTestClass {
  private async prepareProcessesForUserByRole(dto: { user: UserEntity; role: ProcessUserRoleEnum; count: number }) {
    const prcesses = await this.getBuilder(ProcessBuilder).buildMany(dto.count);
    switch (dto.role) {
      case ProcessUserRoleEnum.participant:
        const userProcesses: ProcessParticipantEntity[] = [];

        prcesses.forEach((process) => {
          const usr = new ProcessParticipantEntity();
          usr.user = dto.user;
          usr.process = process;
          userProcesses.push(usr);
        });

        await this.app
          .get<Repository<ProcessParticipantEntity>>(getRepositoryToken(ProcessParticipantEntity))
          .save(userProcesses);

        break;
      case ProcessUserRoleEnum.manager:
        const userProcessesManagers: ProcessManagersEntity[] = [];

        prcesses.forEach((process) => {
          const usr = new ProcessManagersEntity();
          usr.user = dto.user;
          usr.process = process;
          userProcessesManagers.push(usr);
        });

        await this.app
          .get<Repository<ProcessManagersEntity>>(getRepositoryToken(ProcessManagersEntity))
          .save(userProcessesManagers);
        break;

      case ProcessUserRoleEnum.expert:
        const steps: StepEntity[] = [];
        const stepExperts: StepExpertsEntity[] = [];

        prcesses.forEach((process) => {
          const step = this.getBuilder(StepBuilder).withProcess(process).buildEntity();
          steps.push(step);
        });

        await this.app.get<Repository<StepEntity>>(getRepositoryToken(StepEntity)).save(steps);

        steps.forEach((step) => {
          const usr = new StepExpertsEntity();
          usr.user = dto.user;
          usr.step = step;
          stepExperts.push(usr);
        });

        await this.app.get<Repository<StepExpertsEntity>>(getRepositoryToken(StepExpertsEntity)).save(stepExperts);
        break;

      default:
        throw new Error('Unknown role');
    }
    return prcesses;
  }

  @test()
  async getAllProcessesForProcessAdminSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    await this.getBuilder(ProcessBuilder).buildMany(20);

    const query: ProcessGetAllDto = {
      role: ProcessGetAllByRoleEnum.all,
      limit: 5,
      offset: 5,
    };

    const resGetAll = await this.httpRequest().withAuth(processAdmin).get('/process/all').query(query).execute();

    expect(resGetAll.status).toBe(200);
    expect(resGetAll['body'].count).toBe(20);
    expect(resGetAll['body'].items.length).toBe(5);
  }

  @test()
  async getAllProcessesByRoleCheck() {
    const countUserProcess = 10;
    const user = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .build();

    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const processesUser = await this.prepareProcessesForUserByRole({
      user,
      role: ProcessUserRoleEnum.participant,
      count: countUserProcess,
    });

    const processesManager = await this.prepareProcessesForUserByRole({
      user,
      role: ProcessUserRoleEnum.manager,
      count: countUserProcess,
    });

    const processesExpert = await this.prepareProcessesForUserByRole({
      user,
      role: ProcessUserRoleEnum.expert,
      count: countUserProcess,
    });

    const query: ProcessGetAllDto = {
      role: ProcessGetAllByRoleEnum.participant,
      limit: 50,
      offset: 0,
    };

    const resGetForUser = await this.httpRequest().withAuth(user).get('/process/all').query(query).execute();

    expect(resGetForUser.status).toBe(200);
    expect(resGetForUser['body'].count).toBe(countUserProcess);
    for (const item of resGetForUser['body'].items) {
      expect(processesUser.find((p) => p.id === item.id)).toBeDefined();
    }

    query.role = ProcessGetAllByRoleEnum.manager;
    const resGetForManagers = await this.httpRequest().withAuth(user).get('/process/all').query(query).execute();

    expect(resGetForManagers.status).toBe(200);
    expect(resGetForManagers['body'].count).toBe(countUserProcess);
    for (const item of resGetForManagers['body'].items) {
      expect(processesManager.find((p) => p.id === item.id)).toBeDefined();
    }

    query.role = ProcessGetAllByRoleEnum.expert;
    const resGetForExperts = await this.httpRequest().withAuth(user).get('/process/all').query(query).execute();

    expect(resGetForExperts.status).toBe(200);
    expect(resGetForExperts['body'].count).toBe(countUserProcess);
    for (const item of resGetForExperts['body'].items) {
      expect(processesExpert.find((p) => p.id === item.id)).toBeDefined();
    }

    query.role = ProcessGetAllByRoleEnum.all;
    const resGetForAll = await this.httpRequest().withAuth(processAdmin).get('/process/all').query(query).execute();

    expect(resGetForAll.status).toBe(200);
    expect(resGetForAll['body'].count).toBe(countUserProcess * 3);
  }

  @test()
  async getAllProcessesCheckDateFilters() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    await this.getBuilder(ProcessBuilder).buildMany(20);

    const query: ProcessGetAllDto = {
      role: ProcessGetAllByRoleEnum.all,
      startDate: dayjs().add(1, 'day').toDate(),
      endDate: dayjs().add(3, 'day').toDate(),
      limit: 10,
      offset: 0,
    };

    const resGetAll = await this.httpRequest().withAuth(processAdmin).get('/process/all').query(query).execute();

    expect(resGetAll.status).toBe(200);
    expect(resGetAll['body'].count).toBe(20);
    expect(resGetAll['body'].items.length).toBe(10);

    query.startDate = dayjs().add(2, 'day').toDate();

    const resGetAllChangeDate = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process/all')
      .query(query)
      .execute();

    expect(resGetAllChangeDate.status).toBe(200);
    expect(resGetAllChangeDate['body'].count).toBe(0);
    expect(resGetAllChangeDate['body'].items.length).toBe(0);
  }

  @test()
  async getAllProcessesCheckStatusFilters() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    await this.getBuilder(ProcessBuilder).buildMany(10);

    const processesInProgress = await this.getBuilder(ProcessBuilder)
      .withStatus(ProcessStatusEnum.inProgress)
      .buildMany(5);

    const query: ProcessGetAllDto = {
      role: ProcessGetAllByRoleEnum.all,
      status: ProcessStatusEnum.inProgress,
      limit: 10,
      offset: 0,
    };

    const resGetAllInProgress = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process/all')
      .query(query)
      .execute();

    expect(resGetAllInProgress.status).toBe(200);
    expect(resGetAllInProgress['body'].count).toBe(5);
    expect(resGetAllInProgress['body'].items.length).toBe(5);

    for (const item of resGetAllInProgress['body'].items) {
      expect(processesInProgress.find((p) => p.id === item.id)).toBeDefined();
      expect(item.status).toBe(ProcessStatusEnum.inProgress);
    }

    timekeeper.freeze(dayjs().add(4, 'day').toDate());

    const resGetAllInProgressAfterTime = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process/all')
      .query(query)
      .execute();

    expect(resGetAllInProgressAfterTime.status).toBe(200);
    expect(resGetAllInProgressAfterTime['body'].count).toBe(0);
    expect(resGetAllInProgressAfterTime['body'].items.length).toBe(0);

    query.status = ProcessStatusEnum.finished;

    await this.queryRunner.commitTransaction();
    await this.queryRunner.startTransaction();

    const resGetAllFinished = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process/all')
      .query(query)
      .execute();

    expect(resGetAllFinished.status).toBe(200);
    expect(resGetAllFinished['body'].count).toBe(15);
    expect(resGetAllFinished['body'].items.length).toBe(10);

    for (const item of resGetAllFinished['body'].items) {
      expect(item.status).toBe(ProcessStatusEnum.finished);
    }

    timekeeper.reset();
  }
}
describe('', () => {});
