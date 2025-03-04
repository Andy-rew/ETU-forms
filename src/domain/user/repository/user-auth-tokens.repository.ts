import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthTokensRepository {
  constructor(@InjectRepository(UserAuthTokensEntity) private readonly repo: Repository<UserAuthTokensEntity>) {}

  saveWithUser(userAuthToken: UserAuthTokensEntity): Promise<UserAuthTokensEntity> {
    return this.repo.save(userAuthToken);
  }
}
