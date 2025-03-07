import { UserPasswordEntity } from '@domain/user/entities/user-password.entity';
import * as dayjs from 'dayjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';

export class UserPasswordBuilder {
  constructor(private readonly app: INestApplication) {}

  private activationCode = 'dsjcljdsajcfwefewsacalcsa';
  private user: UserEntity;

  withUser(user: UserEntity) {
    this.user = user;
    return this;
  }

  buildEntity(): UserPasswordEntity {
    if (!this.user) {
      throw new Error('User is not set');
    }

    const userPassword = new UserPasswordEntity();
    userPassword.activationCode = this.activationCode;
    userPassword.activationCodeExpiredAt = dayjs().add(2, 'days').toDate();
    userPassword.password = null;
    // userPassword.user = this.user;
    userPassword.userId = this.user.id;
    return userPassword;
  }

  async build(): Promise<UserPasswordEntity> {
    const userPassword = this.buildEntity();
    await this.app.get(getRepositoryToken(UserPasswordEntity)).save(userPassword);
    return userPassword;
  }
}
