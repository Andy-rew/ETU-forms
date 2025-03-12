import { BaseTestClass } from '../../BaseTest';
import { suite, test } from 'object-oriented-tests-jest';
import { UserBuilder } from '../../builders/user.builder';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { ProcessAdminProcessCreateDto } from '@applications/http/process-admin/process/request/process-admin-process-create.dto';
import * as dayjs from 'dayjs';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import { ProcessAdminProcessEditDto } from '@applications/http/process-admin/process/request/process-admin-process-edit.dto';

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
}
describe('', () => {});
