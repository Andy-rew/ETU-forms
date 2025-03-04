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
}
