import { BaseTestClass } from '../../BaseTest';
import { suite, test } from 'object-oriented-tests-jest';
import { UserBuilder } from '../../builders/user.builder';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { ProcessAdminCreateProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-create-process-step.dto';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import * as dayjs from 'dayjs';
import { CommonStepService } from '@domain/step/services/common-step.service';
import { ProcessBuilder } from '../../builders/process.builder';
import { ProcessUsersService } from '@domain/process/services/process-users.service';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';

import { ProcessAdminGetAllProcessStepsDto } from '@applications/http/process-admin/step/request/process-admin-get-all-process-steps.dto';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessAdminViewProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-view-process-step.dto';

@suite()
export class ProcessAdminStepControllerTest extends BaseTestClass {
  private async prepareProcessParticipants(dto: { count: number; admin: UserEntity }) {
    const process = await this.getBuilder(ProcessBuilder).withProcessAdmin(dto.admin).build();
    const usersToAdd = await this.getBuilder(UserBuilder).buildMany(dto.count);

    const processAdmin = await new UserBuilder(this.app).withEmail('ffefwef@eded.de').build();

    await this.getService(ProcessUsersService).addUsersToProcess({
      processId: process.id,
      emails: usersToAdd.map((user) => user.email),
      currentUser: processAdmin,
      userType: ProcessUserRoleEnum.participant,
    });

    return { process, processAdmin, processParticipants: usersToAdd };
  }
  private async prepareProcessWithSomeSteps(admin: UserEntity) {
    const processParticipantsCount = 20;

    const { process } = await this.prepareProcessParticipants({ count: processParticipantsCount, admin });

    const defaultStepData = {
      processId: process.id,
      title: 'Тестовый этап',
      startTime: dayjs().add(1, 'day').toDate(),
      endTime: dayjs().add(2, 'day').toDate(),
      participantsCount: null,
      parentId: null,
    };

    const step1 = await this.getService(CommonStepService).create({
      ...defaultStepData,
      title: 'Тестовый этап 1',
    });

    const step2 = await this.getService(CommonStepService).create({
      ...defaultStepData,
      title: 'Тестовый этап 2',
      parentId: step1.id,
      participantsCount: processParticipantsCount,
    });

    const step3 = await this.getService(CommonStepService).create({
      ...defaultStepData,
      title: 'Тестовый этап 3',
      parentId: step2.id,
      participantsCount: processParticipantsCount - 5,
    });

    process.steps = [step1, step2, step3];
    return process;
  }

  @test()
  async createStepSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const dataForCreation = {
      title: 'Тестовый процесс',
      startDate: dayjs().add(1, 'day').toDate(),
      endDate: dayjs().add(2, 'day').toDate(),
    };

    const process = await this.getService(CommonProcessService).create({
      title: dataForCreation.title,
      startDate: dataForCreation.startDate,
      endDate: dataForCreation.endDate,
      processAdmin: processAdmin,
    });

    const body: ProcessAdminCreateProcessStepDto = {
      processId: process.id,
      title: 'Тестовый этап',
      startTime: dayjs().add(1, 'day').toDate(),
      endTime: dayjs().add(2, 'day').toDate(),
      participantsCount: null,
      parentId: null,
    };

    const resCreate = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/steps/create')
      .body(body)
      .execute();

    expect(resCreate.status).toBe(201);
  }

  @test()
  async getAllProcessStepsSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const processWithSteps = await this.prepareProcessWithSomeSteps(processAdmin);

    const queryForGetALl: ProcessAdminGetAllProcessStepsDto = {
      processId: processWithSteps.id,
    };

    const resGetAll = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process-admin/process/steps/all')
      .query(queryForGetALl)
      .execute();

    expect(resGetAll.status).toBe(200);
  }

  @test()
  async getViewProcessStepsSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const processWithSteps = await this.prepareProcessWithSomeSteps(processAdmin);

    const query: ProcessAdminViewProcessStepDto = {
      processId: processWithSteps.id,
      stepId: processWithSteps.steps[0].id,
    };

    const resGetAll = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process-admin/process/steps/view')
      .query(query)
      .execute();

    expect(resGetAll.status).toBe(200);
  }
}
describe('', () => {});
