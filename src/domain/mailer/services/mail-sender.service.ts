import { Injectable } from '@nestjs/common';
import { ISendMail } from '@domain/mailer/interfaces/send-mail.interface';
import { SendMailDataDto } from '@domain/mailer/dtos/send-mail-data.dto';
import { MessageBodyService } from '@domain/mailer/services/message-body.service';

@Injectable()
export class MailSenderService implements ISendMail {
  constructor(private readonly messageBodyService: MessageBodyService) {}

  async sendMail(dto: SendMailDataDto) {
    const msg = this.messageBodyService.getMailData(dto);
  }
}
