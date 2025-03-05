import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserRepository } from '@domain/user/repository/user.repository';
import { UserStatusEnum } from '@domain/user/enums/user-status.enum';
import { UserManager } from '@domain/user/managers/user.manager';
import { AuthUtilsService } from '@domain/auth/services/auth-utils.service';
import { ISendMail } from '@domain/mailer/interfaces/send-mail.interface';
import { MailTypeEnum } from '@domain/mailer/enums/mail-type.enum';

@Injectable()
export class CommonUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userManager: UserManager,
    private readonly authUtilsService: AuthUtilsService,
    @Inject('MAIL_SENDER_INTERFACE') private readonly mailSender: ISendMail,
  ) {}

  private async userNotExistInviteLogic(dto: {
    email: string;
    name: string;
    surname: string;
    roles: UserRoleEnum[];
    patronymic?: string | null;
    sender: UserEntity;
  }): Promise<UserEntity> {
    const codeObj = await this.authUtilsService.generateActivationCodeWithExpirationDate();

    const newUser = this.userManager.createNewForInvite({
      name: dto.name,
      surname: dto.surname,
      patronymic: dto.patronymic,
      email: dto.email,
      roles: dto.roles,
      activationCode: codeObj.activationCode,
      activationCodeExpiresAt: codeObj.expiresAt,
    });

    return this.userRepository.saveWithPasswordTransaction(newUser);
  }

  private async userExistInviteLogic(dto: {
    existUser: UserEntity;
    email: string;
    name: string;
    surname: string;
    roles: UserRoleEnum[];
    patronymic?: string | null;
    sender: UserEntity;
  }): Promise<UserEntity> {
    if (dto.existUser.status === UserStatusEnum.activated) {
      throw new BadRequestException('User is already activated');
    }

    const codeObj = await this.authUtilsService.generateActivationCodeWithExpirationDate();

    const updatedExistUser = this.userManager.createExistForInvite({
      existUser: dto.existUser,
      name: dto.name,
      surname: dto.surname,
      patronymic: dto.patronymic,
      email: dto.email,
      roles: dto.roles,
      activationCode: codeObj.activationCode,
      activationCodeExpiresAt: codeObj.expiresAt,
    });

    return this.userRepository.saveWithPasswordTransaction(updatedExistUser);
  }

  async invite(dto: {
    email: string;
    name: string;
    surname: string;
    roles: UserRoleEnum[];
    patronymic?: string | null;
    sender: UserEntity;
  }) {
    const user = await this.userRepository.findByEmail(dto.email);

    let userForInvite: UserEntity;

    if (user) {
      userForInvite = await this.userExistInviteLogic({
        existUser: user,
        email: dto.email,
        name: dto.name,
        surname: dto.surname,
        roles: dto.roles,
        patronymic: dto.patronymic,
        sender: dto.sender,
      });
    }

    if (!user) {
      userForInvite = await this.userNotExistInviteLogic({
        email: dto.email,
        name: dto.name,
        surname: dto.surname,
        roles: dto.roles,
        patronymic: dto.patronymic,
        sender: dto.sender,
      });
    }

    await this.mailSender.sendMail({
      to: userForInvite,
      from: dto.sender,
      subject: 'Invitation',
      type: MailTypeEnum.invite,
    });
  }
}
