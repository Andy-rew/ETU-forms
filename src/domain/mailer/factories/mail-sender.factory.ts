import { Injectable } from '@nestjs/common';
import { ISendMail } from '@domain/mailer/interfaces/send-mail.interface';
import { CONFIGS, Server } from '../../../../config/configuration/configuration';
import { ConfigService } from '@nestjs/config';
import { MockMailSenderService } from '@domain/mailer/services/mock-mail-sender.service';
import { MailSenderService } from '@domain/mailer/services/mail-sender.service';

@Injectable()
export class MailSenderFactory {
  private readonly serverEnvConfig: Server;

  constructor(
    private readonly configService: ConfigService,
    private readonly mockMailSenderService: MockMailSenderService,
    private readonly mailSenderService: MailSenderService,
  ) {
    this.serverEnvConfig = this.configService.get<Server>(CONFIGS.server);
  }

  createMailSender(): ISendMail {
    if (['local', 'test'].includes(this.serverEnvConfig.env)) {
      return this.mockMailSenderService;
    }
    return this.mailSenderService;
  }
}
