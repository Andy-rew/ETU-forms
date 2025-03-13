import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CONFIGS, UrlCodeExpiration } from '../../../../config/configuration/configuration';
import * as dayjs from 'dayjs';
import { randomBytes } from 'node:crypto';

@Injectable()
export class AuthUtilsService {
  private urlCodeConfig: UrlCodeExpiration;

  constructor(private readonly configService: ConfigService) {
    this.urlCodeConfig = this.configService.get(CONFIGS.urlCodeExpiration);
  }

  async checkPasswordHashOrFail(dto: { enteredPassword: string; hashedPassword: string }): Promise<void> {
    const isCorrectPassword = await bcrypt.compare(dto.enteredPassword, dto.hashedPassword);
    if (!isCorrectPassword) {
      throw new BadRequestException('Incorrect email or password');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  generateActivationCodeWithExpirationDate(): { activationCode: string; expiresAt: Date } {
    const activationCode = randomBytes(20).toString('hex') + new Date().valueOf().toString();
    const expiresAt = dayjs().add(this.urlCodeConfig.activationCodeExpireTimeMinutes, 'minutes').toDate();

    return { activationCode, expiresAt };
  }
}
