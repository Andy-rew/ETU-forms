import { suite, test } from 'object-oriented-tests-jest';
import { BaseTestClass } from '../BaseTest';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { ProcessBuilder } from '../builders/process.builder';
import * as dayjs from 'dayjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { Repository } from 'typeorm';
import { UserBuilder } from '../builders/user.builder';
import { ProcessUsersService } from '@domain/process/services/process-users.service';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { ProcessManagersEntity } from '@domain/process/entities/process-managers.entity';
import { StepBuilder } from '../builders/step.builder';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';

@suite()
export class CommonProcessTest extends BaseTestClass {
  @test()
  async createProcess() {
    const dataForCreation = {
      title: 'Тестовый процесс',
      startDate: new Date(),
      endDate: new Date(),
    };

    const processAdmin = await this.getBuilder(UserBuilder).build();

    const process = await this.getService(CommonProcessService).create({
      title: dataForCreation.title,
      startDate: dataForCreation.startDate,
      endDate: dataForCreation.endDate,
      processAdmin: processAdmin,
    });

    expect(process.id).toBeDefined();
    expect(process.title).toBe(dataForCreation.title);
    expect(process.startDate).toBe(dataForCreation.startDate);
    expect(process.endDate).toBe(dataForCreation.endDate);
    expect(process.status).toBe(ProcessStatusEnum.draft);
    expect(process.userManagers.length).toBe(1);
  }

  @test()
  async editProcess() {
    const dataForEdit = {
      title: 'Тестовый процесс изменен',
      startDate: dayjs().add(1, 'day').toDate(),
      endDate: dayjs().add(2, 'day').toDate(),
      description: 'Тестовое описание',
    };

    const process = await this.getBuilder(ProcessBuilder).build();

    const updatedProcess = await this.getService(CommonProcessService).update({
      id: process.id,
      title: dataForEdit.title,
      startDate: dataForEdit.startDate,
      endDate: dataForEdit.endDate,
      description: dataForEdit.description,
    });

    expect(updatedProcess.id).toBe(process.id);
    expect(updatedProcess.title).toBe(dataForEdit.title);
    expect(updatedProcess.startDate).toBe(dataForEdit.startDate);
    expect(updatedProcess.endDate).toBe(dataForEdit.endDate);
    expect(updatedProcess.description).toBe(dataForEdit.description);
    expect(updatedProcess.status).toBe(ProcessStatusEnum.draft);
  }

  @test()
  async deleteProcess() {
    const process = await this.getBuilder(ProcessBuilder).build();

    await this.getService(CommonProcessService).delete(process.id);

    const deletedProcess = await this.app
      .get<Repository<ProcessEntity>>(getRepositoryToken(ProcessEntity))
      .findOneBy({ id: process.id });

    expect(deletedProcess).toBe(null);
  }

  @test()
  async addParticipantsToProcessSuccess() {
    const participantsCount = 5;

    const process = await this.getBuilder(ProcessBuilder).build();
    const usersToAdd = await this.getBuilder(UserBuilder).buildMany(participantsCount);

    const processAdmin = await new UserBuilder(this.app).withEmail('ffefwef@eded.de').build();

    await this.getService(ProcessUsersService).addUsersToProcess({
      processId: process.id,
      emails: usersToAdd.map((user) => user.email),
      currentUser: processAdmin,
      userType: ProcessUserRoleEnum.participant,
    });

    const participants = await this.app
      .get<Repository<ProcessParticipantEntity>>(getRepositoryToken(ProcessParticipantEntity))
      .find({ where: { process: { id: process.id } }, relations: { user: true } });

    for (const user of usersToAdd) {
      const findUser = participants.find((participant) => participant.user.id === user.id);
      expect(findUser).toBeDefined();
      expect(findUser.user.id).toBe(user.id);
    }
  }

  @test()
  async addManagersToProcessSuccess() {
    const managersCount = 5;

    const process = await this.getBuilder(ProcessBuilder).build();
    const usersToAdd = await this.getBuilder(UserBuilder).buildMany(managersCount);

    const processAdmin = await new UserBuilder(this.app).withEmail('ffefwef@eded.de').build();

    await this.getService(ProcessUsersService).addUsersToProcess({
      processId: process.id,
      emails: usersToAdd.map((user) => user.email),
      currentUser: processAdmin,
      userType: ProcessUserRoleEnum.manager,
    });

    const managers = await this.app
      .get<Repository<ProcessManagersEntity>>(getRepositoryToken(ProcessManagersEntity))
      .find({ where: { process: { id: process.id } }, relations: { user: true } });

    for (const user of usersToAdd) {
      const findUser = managers.find((participant) => participant.user.id === user.id);
      expect(findUser).toBeDefined();
      expect(findUser.user.id).toBe(user.id);
    }
  }

  @test()
  async addExpertsToProcessStepSuccess() {
    const expertsCount = 5;

    const process = await this.getBuilder(ProcessBuilder).build();
    const step = await this.getBuilder(StepBuilder).withProcess(process).build();
    const usersToAdd = await this.getBuilder(UserBuilder).buildMany(expertsCount);

    const processAdmin = await new UserBuilder(this.app).withEmail('ffefwef@eded.de').build();

    await this.getService(ProcessUsersService).addUsersToProcess({
      processId: process.id,
      emails: usersToAdd.map((user) => user.email),
      currentUser: processAdmin,
      stepId: step.id,
      userType: ProcessUserRoleEnum.expert,
    });

    const experts = await this.app
      .get<Repository<StepExpertsEntity>>(getRepositoryToken(StepExpertsEntity))
      .find({ where: { step: { id: step.id } }, relations: { user: true } });

    await this.queryRunner.commitTransaction();
    await this.queryRunner.startTransaction();

    for (const user of usersToAdd) {
      const findUser = experts.find((participant) => participant.user.id === user.id);
      expect(findUser).toBeDefined();
      expect(findUser.user.id).toBe(user.id);
    }
  }
}
describe('', () => {});
