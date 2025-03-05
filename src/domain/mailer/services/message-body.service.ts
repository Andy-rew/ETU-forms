import { BadRequestException, Injectable } from '@nestjs/common';
import { SendMailDataDto } from '@domain/mailer/dtos/send-mail-data.dto';
import { CONFIGS, Links } from '../../../../config/configuration/configuration';
import { ConfigService } from '@nestjs/config';
import { MailTypeEnum } from '@domain/mailer/enums/mail-type.enum';

@Injectable()
export class MessageBodyService {
  private links: Links;

  constructor(private readonly configService: ConfigService) {
    this.links = this.configService.get<Links>(CONFIGS.links);
  }

  private inviteMailBody(dto: SendMailDataDto) {
    if (!dto.to.password) {
      throw new BadRequestException('Password data for user not passed');
    }

    const newMsg: SendMailDataDto = dto;

    newMsg.subject = 'Приглашение в систему';

    const inviteLink = `${this.links.registrationPageUrl}?token=${dto.to.password.activationCode}`;

    newMsg.html = `
      <h1>Приглашение в систему</h1>
      <p>Для входа в систему перейдите по ссылке: <a href="${inviteLink}">${inviteLink}</a></p>`;

    return newMsg;
  }

  private passwordRecoveryMailBody(dto: SendMailDataDto) {
    if (!dto.to.password) {
      throw new BadRequestException('Password data for user not passed');
    }

    const newMsg: SendMailDataDto = dto;

    newMsg.subject = 'Восстановление пароля';

    const passwordRecoveryLink = `${this.links.passwordRecoveryPageUrl}?token=${dto.to.password.activationCode}`;

    newMsg.html = `
      <h1>Восстановление пароля</h1>
      <p>Для восстановления пароля перейдите по ссылке: <a href="${passwordRecoveryLink}">${passwordRecoveryLink}</a></p>`;

    return newMsg;
  }

  getMailData(dto: SendMailDataDto): SendMailDataDto {
    switch (dto.type) {
      case MailTypeEnum.invite:
        return this.inviteMailBody(dto);
      case MailTypeEnum.passwordRecovery:
        return this.passwordRecoveryMailBody(dto);
      default:
        throw new Error('Invalid mail type');
    }
  }
}
