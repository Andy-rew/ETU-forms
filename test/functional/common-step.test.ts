import { BaseTestClass } from '../BaseTest';
import { suite, test } from 'object-oriented-tests-jest';
import * as dayjs from 'dayjs';
import { CommonStepService } from '@domain/step/services/common-step.service';
import { ProcessBuilder } from '../builders/process.builder';

@suite()
export class CommonStepTest extends BaseTestClass {
  @test()
  async createSeveralProcessStepsSuccess() {
    const process = await this.getBuilder(ProcessBuilder).build();

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

    expect(step1.id).not.toBeNull();

    const step2 = await this.getService(CommonStepService).create({
      ...defaultStepData,
      title: 'Тестовый этап 2',
      parentId: step1.id,
      participantsCount: 10,
    });

    expect(step2.id).not.toBeNull();
  }
}
describe('', () => {});
