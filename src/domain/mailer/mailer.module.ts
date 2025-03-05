import { Module } from '@nestjs/common';
import { MailSenderFactory } from '@domain/mailer/factories/mail-sender.factory';
import { ISendMail } from '@domain/mailer/interfaces/send-mail.interface';
import { MockMailSenderService } from '@domain/mailer/services/mock-mail-sender.service';
import { MailSenderService } from '@domain/mailer/services/mail-sender.service';
import { MessageBodyService } from '@domain/mailer/services/message-body.service';

@Module({
  providers: [
    MockMailSenderService,
    MailSenderService,
    MailSenderFactory,
    MessageBodyService,
    {
      provide: 'MAIL_SENDER_INTERFACE',
      useFactory: (mailServiceFactory: MailSenderFactory): ISendMail => {
        return mailServiceFactory.createMailSender();
      },
      inject: [MailSenderFactory],
    },
  ],
  exports: [MockMailSenderService, MailSenderService, 'MAIL_SENDER_INTERFACE'],
})
export class MailerModule {}
