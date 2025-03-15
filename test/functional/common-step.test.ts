import { BaseTestClass } from '../BaseTest';
import { suite, test } from 'object-oriented-tests-jest';
import * as dayjs from 'dayjs';
import { CommonStepService } from '@domain/step/services/common-step.service';
import { ProcessBuilder } from '../builders/process.builder';
import { UserBuilder } from '../builders/user.builder';
import { ProcessUsersService } from '@domain/process/services/process-users.service';
import { ProcessUserRoleEnum } from '@domain/process/enums/process-user-role.enum';

@suite()
export class CommonStepTest extends BaseTestClass {
  private async prepareProcessParticipants(dto: { count: number }) {
    const process = await this.getBuilder(ProcessBuilder).build();
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

  @test()
  async createSeveralProcessStepsSuccess() {
    const processParticipantsCount = 20;

    const { process } = await this.prepareProcessParticipants({ count: processParticipantsCount });

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
      participantsCount: processParticipantsCount,
    });

    expect(step2.id).not.toBeNull();

    const step3 = await this.getService(CommonStepService).create({
      ...defaultStepData,
      title: 'Тестовый этап 3',
      parentId: step2.id,
      participantsCount: processParticipantsCount - 5,
    });

    expect(step3.id).not.toBeNull();
  }
}
describe('', () => {});
