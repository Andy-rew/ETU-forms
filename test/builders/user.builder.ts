import { INestApplication } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';

export class UserBuilder {
  constructor(private readonly app: INestApplication) {}

  private name = 'Иван';
  private surname = 'Иванов';
  private patronymic = 'Иванович';
  private email = 'test@mail.ru';
  private status = UserStatusEnum.activated;
  private roles = [UserRoleEnum.processAdmin];

  public withName(name: string): this {
    this.name = name;
    return this;
  }

  public withSurname(surname: string): this {
    this.surname = surname;
    return this;
  }

  public withPatronymic(patronymic: string): this {
    this.patronymic = patronymic;
    return this;
  }

  public withEmail(email: string): this {
    this.email = email;
    return this;
  }

  public withStatus(status: UserStatusEnum): this {
    this.status = status;
    return this;
  }

  public withRoles(roles: UserRoleEnum[]): this {
    this.roles = roles;
    return this;
  }

  buildEntity(): UserEntity {
    const user = new UserEntity();
    user.name = this.name;
    user.surname = this.surname;
    user.patronymic = this.patronymic;
    user.email = this.email;
    user.status = this.status;
    user.roles = this.roles;
    return user;
  }

  async build(): Promise<UserEntity> {
    const user = this.buildEntity();
    return this.app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity)).save(user);
  }

  async buildMany(count: number): Promise<UserEntity[]> {
    const users: UserEntity[] = [];

    for (let i = 0; i < count; i++) {
      this.email = `test${new Date().getTime()}${i}@mail.ru`;
      this.roles = [UserRoleEnum.user];
      const user = this.buildEntity();
      users.push(user);
    }

    return this.app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity)).save(users);
  }
}
