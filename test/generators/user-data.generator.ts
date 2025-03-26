import { INestApplication } from '@nestjs/common';

export class UserDataGenerator {
  constructor(private readonly app: INestApplication) {}

  async generateSomeUsers() {}
}
