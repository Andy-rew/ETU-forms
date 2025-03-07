import { BaseTestClass } from '../BaseTest';
import { suite, test } from 'object-oriented-tests-jest';
import { UserBuilder } from '../builders/user.builder';
import { UserPasswordBuilder } from '../builders/user-password.builder';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { AuthService } from '@domain/auth/services/auth.service';
import * as dayjs from 'dayjs';
import * as timekeeper from 'timekeeper';
import { NotFoundException } from '@nestjs/common';

@suite()
export class AuthServiceTest extends BaseTestClass {
  async prepareUserForSignUp() {
    const user = await this.getBuilder(UserBuilder).withStatus(UserStatusEnum.invited).build();
    const userPassword = await this.getBuilder(UserPasswordBuilder).withUser(user).build();

    user.password = userPassword;

    return user;
  }

  async prepareUserForSignIn(dto: { password: string }) {
    const user = await this.prepareUserForSignUp();

    const signedUpUserPassword = await this.getService(AuthService).signUpByActivationCode({
      activationCode: user.password.activationCode,
      password: dto.password,
      samePassword: dto.password,
    });

    return signedUpUserPassword.user;
  }

  async prepareForRefreshAndSignOut() {
    const pass = 'password1234';
    const user = await this.prepareUserForSignIn({ password: pass });
    const tokens = await this.getService(AuthService).signIn({ email: user.email, password: pass });

    return { tokens, user, pass };
  }

  @test()
  async signUpByActivationCodeSuccess() {
    const user = await this.prepareUserForSignUp();
    const password = 'password';

    const res = await this.getService(AuthService).signUpByActivationCode({
      activationCode: user.password.activationCode,
      password: password,
      samePassword: password,
    });

    expect(res).toBeDefined();
    expect(res.activationCode).toBe(null);
    expect(res.password).not.toBe(null);

    expect(res.user.status).toBe(UserStatusEnum.activated);
  }

  @test()
  async signInSuccess() {
    const pass = 'password1234';
    const user = await this.prepareUserForSignIn({ password: pass });

    const res = await this.getService(AuthService).signIn({ email: user.email, password: pass });

    expect(res).toBeDefined();
    expect(res.accessToken).not.toBe(null);
    expect(res.refreshToken).not.toBe(null);
    expect(res.accessTokenExpiredAt).not.toBe(null);
    expect(res.refreshTokenExpiredAt).not.toBe(null);
  }

  @test()
  async refreshTokenSuccess() {
    const { tokens, user } = await this.prepareForRefreshAndSignOut();

    const time = dayjs().add(1, 'hours').toDate();
    timekeeper.freeze(time);

    const res = await this.getService(AuthService).refreshTokens({
      refreshToken: tokens.refreshToken,
      currentUser: user,
    });

    expect(res).toBeDefined();
    expect(res.id).toBe(tokens.id);
    expect(res.accessToken).not.toEqual(tokens.accessToken);
    expect(res.refreshToken).not.toEqual(tokens.refreshToken);
    expect(dayjs(res.refreshTokenExpiredAt).isAfter(tokens.refreshTokenExpiredAt)).toBe(true);
    expect(dayjs(res.accessTokenExpiredAt).isAfter(tokens.accessTokenExpiredAt)).toBe(true);

    timekeeper.reset();
  }

  @test()
  async signOutSuccess() {
    const { tokens, user } = await this.prepareForRefreshAndSignOut();

    await this.getService(AuthService).signOut({ accessToken: tokens.accessToken, userId: user.id });

    try {
      await this.getService(AuthService).refreshTokens({
        refreshToken: tokens.refreshToken,
        currentUser: user,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
    }
    expect.assertions(1);
  }
}
