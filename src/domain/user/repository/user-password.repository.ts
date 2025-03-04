import { Injectable, NotFoundException } from '@nestjs/common';
import { UserPasswordEntity } from '@domain/user/entities/user-password.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserPasswordRepository {
  constructor(
    @InjectRepository(UserPasswordEntity)
    private readonly repo: Repository<UserPasswordEntity>,
  ) {}

  async saveWithUserTransaction(userPassword: UserPasswordEntity): Promise<UserPasswordEntity> {
    const qr = this.repo.manager.connection.createQueryRunner();
    await qr.startTransaction();

    try {
      await qr.manager.save(userPassword);
      await qr.manager.save(userPassword.user);

      await qr.commitTransaction();

      return userPassword;
    } catch (error) {
      await qr.rollbackTransaction();
      throw new Error(error);
    } finally {
      await qr.release();
    }
  }

  async findByActivationCode(activationCode: string): Promise<UserPasswordEntity | null> {
    return this.repo.findOne({ where: { activationCode: activationCode }, relations: { user: true } });
  }

  async finByActivationCodeOrFail(activationCode: string): Promise<UserPasswordEntity> {
    const password = await this.findByActivationCode(activationCode);
    if (!password) {
      throw new NotFoundException('Incorrect activation code');
    }
    return password;
  }
}
