import { BaseTestClass } from '../../BaseTest';
import { suite, test } from 'object-oriented-tests-jest';
import { UserBuilder } from '../../builders/user.builder';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { ProcessAdminProcessCreateDto } from '@applications/http/process-admin/process/request/process-admin-process-create.dto';
import * as dayjs from 'dayjs';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import { ProcessAdminProcessEditDto } from '@applications/http/process-admin/process/request/process-admin-process-edit.dto';
import { ProcessAdminProcessUsersAddDto } from '@applications/http/process-admin/process/request/process-admin-process-users-add.dto';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { CommonStepService } from '@domain/step/services/common-step.service';

@suite()
export class ProcessAdminProcessControllerTest extends BaseTestClass {
  @test()
  async createProcessSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const body: ProcessAdminProcessCreateDto = {
      title: 'Тестовый процесс',
      startDate: dayjs().add(1, 'day').toDate(),
      endDate: dayjs().add(2, 'day').toDate(),
      description: null,
      imageIds: null,
    };

    const resCreate = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/create')
      .body(body)
      .execute();

    expect(resCreate.status).toBe(201);
  }

  @test()
  async getProcessesSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const dataForCreation = {
      title: 'Тестовый процесс',
      startDate: new Date(),
      endDate: new Date(),
    };

    const process = await this.getService(CommonProcessService).create({
      title: dataForCreation.title,
      startDate: dataForCreation.startDate,
      endDate: dataForCreation.endDate,
      processAdmin: processAdmin,
    });

    const resView = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process-admin/process/view')
      .query({
        processId: process.id,
      })
      .execute();

    expect(resView.status).toBe(200);
  }

  @test()
  async deleteProcessesSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const dataForCreation = {
      title: 'Тестовый процесс',
      startDate: new Date(),
      endDate: new Date(),
    };

    const process = await this.getService(CommonProcessService).create({
      title: dataForCreation.title,
      startDate: dataForCreation.startDate,
      endDate: dataForCreation.endDate,
      processAdmin: processAdmin,
    });

    const resView = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/delete')
      .body({
        processId: process.id,
      })
      .execute();

    expect(resView.status).toBe(201);
  }

  @test()
  async editProcessesSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const dataForCreation = {
      title: 'Тестовый процесс',
      startDate: new Date(),
      endDate: new Date(),
    };

    const process = await this.getService(CommonProcessService).create({
      title: dataForCreation.title,
      startDate: dataForCreation.startDate,
      endDate: dataForCreation.endDate,
      processAdmin: processAdmin,
    });

    const body: ProcessAdminProcessEditDto = {
      processId: process.id,
      title: 'Тестовый процесс',
      startDate: dayjs().add(1, 'day').toDate(),
      endDate: dayjs().add(2, 'day').toDate(),
      description: null,
      imageIds: null,
    };

    const res = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/edit')
      .body(body)
      .execute();

    expect(res.status).toBe(201);
  }

  @test()
  async editProcessesByUserWithNotManagerRole() {
    const user = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.user])
      .withStatus(UserStatusEnum.activated)
      .withEmail('d9b4n@example.com')
      .build();

    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const dataForCreation = {
      title: 'Тестовый процесс',
      startDate: new Date(),
      endDate: new Date(),
    };

    const process = await this.getService(CommonProcessService).create({
      title: dataForCreation.title,
      startDate: dataForCreation.startDate,
      endDate: dataForCreation.endDate,
      processAdmin: processAdmin,
    });

    const body: ProcessAdminProcessEditDto = {
      processId: process.id,
      title: 'Тестовый процесс',
      startDate: dayjs().add(1, 'day').toDate(),
      endDate: dayjs().add(2, 'day').toDate(),
      description: null,
      imageIds: null,
    };

    const res = await this.httpRequest().withAuth(user).post('/process-admin/process/edit').body(body).execute();

    expect(res.status).toBe(403);
  }

  @test()
  async addUsersToProcessSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const dataForCreation = {
      title: 'Тестовый процесс',
      startDate: new Date(),
      endDate: dayjs().add(5, 'day').toDate(),
    };

    const process = await this.getService(CommonProcessService).create({
      title: dataForCreation.title,
      startDate: dataForCreation.startDate,
      endDate: dataForCreation.endDate,
      processAdmin: processAdmin,
    });

    const defaultStepData = {
      processId: process.id,
      title: 'Тестовый этап',
      startTime: dayjs().add(1, 'day').toDate(),
      endTime: dayjs().add(2, 'day').toDate(),
      participantsCount: null,
      parentId: null,
    };

    const step = await this.getService(CommonStepService).create({
      ...defaultStepData,
      title: 'Тестовый этап 1',
    });

    const usersToAdd = await this.getBuilder(UserBuilder).buildMany(5);

    const body: ProcessAdminProcessUsersAddDto = {
      userType: ProcessUserRoleEnum.participant,
      processId: process.id,
      emails: usersToAdd.map((user) => user.email),
      stepId: null,
    };

    const resCheckParticipantsAdd = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/users/add')
      .body(body)
      .execute();

    expect(resCheckParticipantsAdd.status).toBe(201);

    body.userType = ProcessUserRoleEnum.manager;

    const resCheckManagersAdd = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/users/add')
      .body(body)
      .execute();

    expect(resCheckManagersAdd.status).toBe(201);

    body.userType = ProcessUserRoleEnum.expert;
    body.stepId = step.id;

    const resCheckExpertsAdd = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/users/add')
      .body(body)
      .execute();

    expect(resCheckExpertsAdd.status).toBe(201);
  }
}
describe('', () => {});
