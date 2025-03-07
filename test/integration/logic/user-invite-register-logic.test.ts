import { suite, test } from 'object-oriented-tests-jest';
import { BaseTestClass } from '../../BaseTest';
import { UserBuilder } from '../../builders/user.builder';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { Repository } from 'typeorm';

@suite()
export class UserInviteRegisterLogicTest extends BaseTestClass {
  async prepare() {
    const userInviter = await this.getBuilder(UserBuilder)
      .withRoles([UserRoleEnum.systemAdmin])
      .withStatus(UserStatusEnum.activated)
      .build();

    const userData = {
      email: 's6K3o@example.com',
      name: 'name',
      surname: 'surname',
      patronymic: 'patronymic',
      roles: [UserRoleEnum.user],
      sender: userInviter,
    };

    return {
      userInviter,
      userData,
    };
  }

  @test()
  async userInviteRegisterLogicSuccess() {
    const { userInviter, userData } = await this.prepare();

    const resInvite = await this.httpRequest()
      .withAuth(userInviter)
      .post('/system-admin/user/invite')
      .body({
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        patronymic: userData.patronymic,
        roles: userData.roles,
      })
      .execute();

    expect(resInvite.status).toBe(201);
    expect(resInvite.body['id']).toBeDefined();
    expect(resInvite.body['id']).not.toBeNull();
    expect(resInvite.body['status']).toBe(UserStatusEnum.invited);

    const invitedUser = await this.getService<Repository<UserEntity>>(getRepositoryToken(UserEntity)).findOne({
      where: { id: resInvite.body['id'] },
      relations: { password: true },
    });

    const password = 'password1234';
    const resSignUp = await this.httpRequest()
      .post('/auth/sign-up')
      .body({
        activationToken: invitedUser.password.activationCode,
        password: password,
        samePassword: password,
      })
      .execute();

    expect(resSignUp.status).toBe(201);
    expect(resSignUp.body['status']).toBe(UserStatusEnum.activated);

    const resSignIn = await this.httpRequest()
      .post('/auth/sign-in')
      .body({
        email: invitedUser.email,
        password: password,
      })
      .execute();

    expect(resSignIn.status).toBe(201);

    const registeredUser = await this.getService<Repository<UserEntity>>(getRepositoryToken(UserEntity)).findOne({
      where: { id: resInvite.body['id'] },
      relations: { password: true },
    });

    const resRefresh = await this.httpRequest()
      .withAuth(registeredUser)
      .post('/auth/refresh')
      .body({
        refreshToken: resSignIn.body['refreshToken'],
      })
      .execute();

    expect(resRefresh.status).toBe(201);
  }
}
describe('', () => {});
