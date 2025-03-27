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
import { UserDataGenerator } from '../../generators/user-data.generator';
import { ProcessAdminProcessUsersGetAllDto } from '@applications/http/process-admin/process/request/process-admin-process-users-get-all.dto';
import { ProcessUsersTypeEnum } from '@domain/process/enums/process-users-type.enum';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { ProcessAdminProcessStatusChangeDto } from '@applications/http/process-admin/process/request/process-admin-process-status-change.dto';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { UserEntity } from '@domain/user/entities/user.entity';
import * as fs from 'node:fs/promises';
import { FormSchemaEntity } from '@domain/form-schema/entities/form-schema.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FormSchemaFilledEntity } from '@domain/form-schema/entities/form-schema-filled.entity';
import { StepBuilder } from '../../builders/step.builder';
import { ProcessAdminProcessFormTemplateViewDto } from '@applications/http/process-admin/process/request/process-admin-process-form-template-view.dto';
import { ProcessAdminProcessFormFilledViewDto } from '@applications/http/process-admin/process/request/process-admin-process-form-filled-view.dto';
import { ProcessAdminProcessLinkAccessDto } from '@applications/http/process-admin/process/request/process-admin-process-link-access.dto';

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

  @test()
  async getUsersForProcess() {
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

    await this.getBuilder(UserDataGenerator).generateSomeUsers();

    const query: ProcessAdminProcessUsersGetAllDto = {
      processId: process.id,
      userStatus: UserStatusEnum.activated,
      userType: ProcessUsersTypeEnum.all,
      limit: 50,
      offset: 0,
    };

    const res = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process-admin/process/users/all')
      .query(query)
      .execute();

    expect(res.status).toBe(200);
  }

  @test()
  async getStudentUsersForProcess() {
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

    await this.getBuilder(UserDataGenerator).generateSomeUsers();

    const query: ProcessAdminProcessUsersGetAllDto = {
      processId: process.id,
      userStatus: UserStatusEnum.activated,
      userType: ProcessUsersTypeEnum.students,
      limit: 50,
      offset: 0,
    };

    const res = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process-admin/process/users/all')
      .query(query)
      .execute();

    expect(res.status).toBe(200);
    res.body.items.forEach((item) => {
      expect(item.educations).toHaveLength(1);
    });
  }

  @test()
  async getWorkerUsersForProcess() {
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

    await this.getBuilder(UserDataGenerator).generateSomeUsers();

    const query: ProcessAdminProcessUsersGetAllDto = {
      processId: process.id,
      userStatus: UserStatusEnum.activated,
      userType: ProcessUsersTypeEnum.workers,
      limit: 50,
      offset: 0,
    };

    const res = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process-admin/process/users/all')
      .query(query)
      .execute();

    expect(res.status).toBe(200);
    res.body.items.forEach((item) => {
      expect(item.userDepartments).toHaveLength(1);
    });
  }

  @test()
  async changeProcessStatus() {
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

    const body: ProcessAdminProcessStatusChangeDto = {
      processId: process.id,
      status: ProcessStatusEnum.inProgress,
    };

    const res = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/status/change')
      .body(body)
      .execute();

    expect(res.status).toBe(201);

    const updatedProcess = await this.getService(ProcessRepository).findByIdOrFail(process.id);

    expect(updatedProcess.status).toBe(ProcessStatusEnum.inProgress);
  }

  async prepareStepAndProcessWithSchemas(admin: UserEntity) {
    const fileSchema = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const fileResult = await fs.readFile(`./test/data/survey-test-schema-result.json`, 'utf-8');
    const schema = JSON.parse(fileSchema);
    const result = JSON.parse(fileResult);

    const schemaEntity = new FormSchemaEntity();
    schemaEntity.schema = schema;
    schemaEntity.title = 'test';

    await this.app.get<Repository<FormSchemaEntity>>(getRepositoryToken(FormSchemaEntity)).save(schemaEntity);

    const resultEntity = new FormSchemaFilledEntity();
    resultEntity.schema = schemaEntity;
    resultEntity.filledSchema = result;

    await this.app
      .get<Repository<FormSchemaFilledEntity>>(getRepositoryToken(FormSchemaFilledEntity))
      .save(resultEntity);

    const dataForCreation = {
      title: 'Тестовый процесс',
      startDate: new Date(),
      endDate: dayjs().add(5, 'day').toDate(),
    };

    const process = await this.getService(CommonProcessService).create({
      title: dataForCreation.title,
      startDate: dataForCreation.startDate,
      endDate: dataForCreation.endDate,
      processAdmin: admin,
    });

    const step = await this.getBuilder(StepBuilder)
      .withAcceptFormSchema(schemaEntity)
      .withDeclineFormSchema(schemaEntity)
      .withFormSchema(schemaEntity)
      .withProcess(process)
      .build();

    return { step, formFilled: resultEntity, schema: schemaEntity };
  }

  @test()
  async getFormSchema() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const { step, schema } = await this.prepareStepAndProcessWithSchemas(processAdmin);

    const query: ProcessAdminProcessFormTemplateViewDto = {
      processId: step.process.id,
      formSchemaId: schema.id,
    };

    const res = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process-admin/process/form-schema')
      .query(query)
      .execute();

    expect(res.status).toBe(200);
  }

  @test()
  async getFilledFormSchema() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const { step, formFilled, schema } = await this.prepareStepAndProcessWithSchemas(processAdmin);

    const query: ProcessAdminProcessFormFilledViewDto = {
      processId: step.process.id,
      formSchemaId: schema.id,
      filledFormId: formFilled.id,
    };

    const res = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process-admin/process/form-filled')
      .query(query)
      .execute();

    expect(res.status).toBe(200);
  }

  @test()
  async setLinkAccess() {
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

    const body: ProcessAdminProcessLinkAccessDto = {
      processId: process.id,
      linkAccess: true,
    };

    const res = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/link-access')
      .body(body)
      .execute();

    expect(res.status).toBe(201);
    const updatedProcess = await this.getService(ProcessRepository).findByIdOrFail(process.id);

    expect(updatedProcess.linkAccess).toBe(true);
  }
}
describe('', () => {});
