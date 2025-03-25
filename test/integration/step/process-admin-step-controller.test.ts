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
import { StepBuilder } from '../../builders/step.builder';
import { ProcessAdminUpdateProcessStepDto } from '@applications/http/process-admin/step/request/process-admin-update-process-step.dto';
import { StepRepository } from '@domain/step/repository/step.repository';
import { ProcessAdminUpdateProcessStepSchemaDto } from '@applications/http/process-admin/step/request/process-admin-update-process-step-schema.dto';
import { SchemaType } from '@domain/form-schema/enums/schema-type.enum';
import * as fs from 'node:fs/promises';
import { CommonSchemasService } from '@domain/form-schema/service/common-schemas.service';
import { ProcessAdminProcessStepExpertMainDto } from '@applications/http/process-admin/step/request/process-admin-process-step-expert-main.dto';
import { StepExpertsRepository } from '@domain/step/repository/step-experts.repository';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { ProcessParticipantRepository } from '@domain/process/repository/process-participant.repository';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { StepParticipantsRepository } from '@domain/step/repository/step-participants.repository';
import { ProcessAdminProcessStepParticipantsDto } from '@applications/http/process-admin/step/request/process-admin-process-step-participants.dto';

@suite()
export class ProcessAdminStepControllerTest extends BaseTestClass {
  private async prepareProcessStepParticipants(dto: { count: number; admin: UserEntity }) {
    const process = await this.getBuilder(ProcessBuilder).withProcessAdmin(dto.admin).build();
    const usersToAdd = await this.getBuilder(UserBuilder).buildMany(dto.count);

    const processParticipants: ProcessParticipantEntity[] = [];

    usersToAdd.forEach((user) => {
      const processParticipant = new ProcessParticipantEntity();
      processParticipant.user = user;
      processParticipant.process = process;
      processParticipants.push(processParticipant);
    });

    const processParticipantsSaved = await this.getService(ProcessParticipantRepository).saveMany(processParticipants);

    const step = await this.getBuilder(StepBuilder).withProcess(process).build();

    const stepParticipants: StepParticipantsEntity[] = [];

    processParticipantsSaved.forEach((processParticipant) => {
      const stepParticipant = new StepParticipantsEntity();
      stepParticipant.processParticipant = processParticipant;
      stepParticipant.step = step;
      stepParticipants.push(stepParticipant);
    });

    const stepParticipantsSaved = await this.getService(StepParticipantsRepository).saveMany(stepParticipants);

    return { process, step, stepParticipants: stepParticipantsSaved };
  }

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

    const start = dayjs().add(1, 'day');
    const end = dayjs().add(1, 'day').add(2, 'hours');

    const defaultStepData = {
      processId: process.id,
      title: 'Тестовый этап',
      startTime: start.toDate(),
      endTime: end.toDate(),
      participantsCount: null,
      parentId: null,
    };

    const step1 = await this.getService(CommonStepService).create({
      ...defaultStepData,
      title: 'Тестовый этап 1',
    });

    const step2 = await this.getService(CommonStepService).create({
      ...defaultStepData,
      startTime: defaultStepData.endTime,
      endTime: dayjs(defaultStepData.endTime).add(2, 'hour').toDate(),
      title: 'Тестовый этап 2',
      parentId: step1.id,
      participantsCount: processParticipantsCount,
    });

    const step3 = await this.getService(CommonStepService).create({
      ...defaultStepData,
      startTime: step2.endTime,
      endTime: dayjs(step2.endTime).add(2, 'hour').toDate(),
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

  @test()
  async editStepSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const step = await this.getBuilder(StepBuilder).build();

    const body: ProcessAdminUpdateProcessStepDto = {
      processId: step.process.id,
      stepId: step.id,
      title: 'Тестовый этап измененный',
      startTime: dayjs().add(1, 'day').toDate(),
      endTime: dayjs().add(2, 'day').toDate(),
      participantsCount: null,
    };

    const resEdit = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/steps/edit')
      .body(body)
      .execute();

    expect(resEdit.status).toBe(201);

    const editedStep = await this.getService(StepRepository).findViewById(step.id);

    expect(editedStep.title).toBe(body.title);
    expect(editedStep.startTime).toEqual(body.startTime);
    expect(editedStep.endTime).toEqual(body.endTime);
    expect(editedStep.participantsCount).toBe(body.participantsCount);
  }

  @test()
  async addExpertsToStepSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const expertsCount = 2;

    const process = await this.getBuilder(ProcessBuilder).build();
    const step = await this.getBuilder(StepBuilder).withProcess(process).build();
    const usersToAdd = await this.getBuilder(UserBuilder).buildMany(expertsCount);

    await this.getService(ProcessUsersService).addUsersToProcess({
      processId: process.id,
      emails: usersToAdd.map((user) => user.email),
      currentUser: processAdmin,
      stepId: step.id,
      userType: ProcessUserRoleEnum.expert,
    });

    const body: ProcessAdminProcessStepExpertMainDto = {
      processId: step.process.id,
      stepId: step.id,
      userId: usersToAdd[0].id,
      isMain: true,
    };

    const resEdit = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/steps/expert/main')
      .body(body)
      .execute();

    expect(resEdit.status).toBe(201);

    const editedStepExpert = await this.getService(StepExpertsRepository).findByStepIdAndProcessId({
      stepId: step.id,
      processId: step.process.id,
      userId: body.userId,
    });

    expect(editedStepExpert.isMain).toBe(true);
  }

  @test()
  async editStepSchemaSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .withAllowTemplates(true)
      .build();

    const step = await this.getBuilder(StepBuilder).build();

    const file = await fs.readFile(`./test/data/survey-test-schema.json`, 'utf-8');
    const schema = JSON.parse(file);

    const userSchemaTemplate = await this.getService(CommonSchemasService).createUserSchema({
      user: processAdmin,
      title: 'fff',
      type: SchemaType.form,
      schema,
    });

    const body: ProcessAdminUpdateProcessStepSchemaDto = {
      processId: step.process.id,
      stepId: step.id,
      type: SchemaType.form,
      schemaId: userSchemaTemplate.schema.id,
    };

    const resEdit = await this.httpRequest()
      .withAuth(processAdmin)
      .post('/process-admin/process/steps/edit/schema')
      .body(body)
      .execute();

    expect(resEdit.status).toBe(201);

    const editedStep = await this.getService(StepRepository).findViewById(step.id);
    expect(editedStep.formSchema.id).toBe(userSchemaTemplate.schema.id);
  }

  @test()
  async getStepParticipantsSuccess() {
    const processAdmin = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.processAdmin])
      .withStatus(UserStatusEnum.activated)
      .withAllowTemplates(true)
      .build();

    const { process, step } = await this.prepareProcessStepParticipants({ count: 50, admin: processAdmin });

    const query: ProcessAdminProcessStepParticipantsDto = {
      processId: process.id,
      stepId: step.id,
      limit: 10,
      offset: 0,
    };

    const resGet = await this.httpRequest()
      .withAuth(processAdmin)
      .get('/process-admin/process/steps/participants')
      .query(query)
      .execute();

    expect(resGet.status).toBe(200);

    expect(resGet.body.count).toBe(50);
  }
}
describe('', () => {});
