import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByIdForAuth(id: number): Promise<UserEntity | null> {
    return this.repo.createQueryBuilder('user').where('user.id = :id', { id }).getOne();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .innerJoinAndSelect('user.password', 'password')
      .withDeleted()
      .getOne();
  }

  async findByEmailWithPasswordDataOrFail(email: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Incorrect email or password');
    }
    return user;
  }

  async saveWithPasswordTransaction(user: UserEntity): Promise<UserEntity> {
    const qr = this.repo.manager.connection.createQueryRunner();
    await qr.startTransaction();
    try {
      const savedUser = await qr.manager.save(user);
      const passwordData = user.password;
      passwordData.user = savedUser;
      savedUser.password = await qr.manager.save(passwordData);
      await qr.commitTransaction();
      return savedUser;
    } catch (error) {
      await qr.rollbackTransaction();
      throw new Error(error);
    } finally {
      await qr.release();
    }
  }

  async saveSeveralWithPasswordTransaction(users: UserEntity[]): Promise<UserEntity[]> {
    const qr = this.repo.manager.connection.createQueryRunner();
    await qr.startTransaction();
    try {
      for (const user of users) {
        const savedUser = await qr.manager.save(user);
        const passwordData = user.password;
        passwordData.user = savedUser;
        savedUser.password = await qr.manager.save(passwordData);
      }

      await qr.commitTransaction();
      return users;
    } catch (error) {
      await qr.rollbackTransaction();
      throw new Error(error);
    } finally {
      await qr.release();
    }
  }

  async findByEmails(emails: string[]): Promise<UserEntity[]> {
    return this.repo.createQueryBuilder('user').where('user.email IN (:...emails)', { emails }).withDeleted().getMany();
  }
}
