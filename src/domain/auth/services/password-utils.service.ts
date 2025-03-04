import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordUtilsService {
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
}
