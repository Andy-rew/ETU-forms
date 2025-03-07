import { BaseTestClass } from '../BaseTest';
import { suite, test } from 'object-oriented-tests-jest';
import { UserBuilder } from '../builders/user.builder';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { CommonUserService } from '@domain/user/services/common-user.service';

@suite()
export class CommonUserTest extends BaseTestClass {
  @test()
  async inviteNotExistUserSuccess() {
    const currentUser = await this.getBuilder(UserBuilder)
      .withStatus(UserStatusEnum.activated)
      .withRoles([UserRoleEnum.systemAdmin])
      .build();

    const userData = {
      email: 's6K3o@example.com',
      name: 'name',
      surname: 'surname',
      patronymic: 'patronymic',
      roles: [UserRoleEnum.user],
      sender: currentUser,
    };

    const res = await this.getService(CommonUserService).invite({
      ...userData,
    });

    expect(res).toBeDefined();
    expect(res.email).toBe(userData.email);
    expect(res.name).toBe(userData.name);
    expect(res.surname).toBe(userData.surname);
    expect(res.patronymic).toBe(userData.patronymic);
    expect(res.roles).toEqual(userData.roles);
    expect(res.status).toBe(UserStatusEnum.invited);

    expect(res.password.password).toBe(null);
    expect(res.password.activationCode).not.toBe(null);
    expect(res.password.activationCodeExpiredAt).not.toBe(null);
  }

  @test()
  async inviteExistUserSuccess() {
    const currentUser = await this.getBuilder(UserBuilder)
      .withStatus(UserStatusEnum.activated)
      .withRoles([UserRoleEnum.systemAdmin])
      .build();

    const userData = {
      email: 's6K3o@example.com',
      name: 'name',
      surname: 'surname',
      patronymic: 'patronymic',
      roles: [UserRoleEnum.user],
      sender: currentUser,
    };

    const res1 = await this.getService(CommonUserService).invite({
      ...userData,
    });

    const res2 = await this.getService(CommonUserService).invite({
      ...userData,
    });

    expect(res1.password.activationCode).not.toBe(null);
    expect(res2.password.activationCode).not.toBe(null);
    expect(res1.password.activationCode).not.toBe(res2.password.activationCode);
  }
}
describe('', () => {});
