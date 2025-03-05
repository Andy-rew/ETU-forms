import { UserEntity } from '@domain/user/entities/user.entity';
import { MailTypeEnum } from '@domain/mailer/enums/mail-type.enum';

export class SendMailDataDto {
  to: UserEntity;
  from: UserEntity;
  type: MailTypeEnum;
  subject: string;
  text?: string;
  html?: string;
}
