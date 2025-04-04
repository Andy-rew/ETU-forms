import { Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { UserPasswordEntity } from '@domain/user/entities/user-password.entity';

@Injectable()
export class UserManager {
  createNewForInvite(dto: {
    name: string;
    surname: string;
    email: string;
    roles: UserRoleEnum[];
    activationCode: string;
    activationCodeExpiresAt: Date;
    patronymic?: string;
  }) {
    const user = new UserEntity();
    user.name = dto.name;
    user.surname = dto.surname;
    user.patronymic = dto.patronymic ?? null;
    user.email = dto.email;
    user.roles = dto.roles;
    user.allowTemplates = dto.roles.includes(UserRoleEnum.processAdmin);
    user.status = UserStatusEnum.invited;

    const userPassword = new UserPasswordEntity();
    userPassword.activationCode = dto.activationCode;
    userPassword.activationCodeExpiredAt = dto.activationCodeExpiresAt;
    userPassword.userId = user.id;
    user.password = userPassword;

    return user;
  }

  createExistForInvite(dto: {
    existUser: UserEntity;
    name: string;
    surname: string;
    email: string;
    roles: UserRoleEnum[];
    activationCode: string;
    activationCodeExpiresAt: Date;
    patronymic?: string;
  }) {
    const user = dto.existUser;
    user.name = dto.name;
    user.surname = dto.surname;
    user.patronymic = dto.patronymic ?? null;
    user.email = dto.email;
    user.roles = dto.roles;
    user.deletedAt = null;
    user.status = UserStatusEnum.invited;

    const userPassword = new UserPasswordEntity();
    userPassword.activationCode = dto.activationCode;
    userPassword.activationCodeExpiredAt = dto.activationCodeExpiresAt;
    userPassword.userId = user.id;
    user.password = userPassword;

    return user;
  }
}
