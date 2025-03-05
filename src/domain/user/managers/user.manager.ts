import { Injectable } from '@nestjs/common';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';

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
    user.status = UserStatusEnum.invited;

    user.password.activationCode = dto.activationCode;
    user.password.activationCodeExpiredAt = dto.activationCodeExpiresAt;

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

    user.password.activationCode = dto.activationCode;
    user.password.activationCodeExpiredAt = dto.activationCodeExpiresAt;

    return user;
  }
}
