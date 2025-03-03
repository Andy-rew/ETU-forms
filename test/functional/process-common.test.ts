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

@suite()
export class ProcessCommonTest extends BaseTestClass {
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
}
describe('', () => {});
