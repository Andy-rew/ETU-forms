import { SendMailDataDto } from '@domain/mailer/dtos/send-mail-data.dto';

export interface ISendMail {
  sendMail(dto: SendMailDataDto): Promise<void>;
}
