import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthTokensRepository {
  constructor(@InjectRepository(UserAuthTokensEntity) private readonly repo: Repository<UserAuthTokensEntity>) {}

  save(userAuthToken: UserAuthTokensEntity): Promise<UserAuthTokensEntity> {
    return this.repo.save(userAuthToken);
  }

  findByRefreshTokenAndUserId(dto: { refreshToken: string; userId: number }): Promise<UserAuthTokensEntity | null> {
    return this.repo.findOne({
      where: { refreshToken: dto.refreshToken, user: { id: dto.userId } },
      relations: { user: true },
    });
  }

  findByRefreshTokenAndUserIdOrFail(dto: { refreshToken: string; userId: number }): Promise<UserAuthTokensEntity> {
    const userToken = this.findByRefreshTokenAndUserId(dto);
    if (!userToken) {
      throw new NotFoundException('User auth token not found');
    }
    return userToken;
  }

  findByAccessTokenAndUserId(dto: { accessToken: string; userId: number }): Promise<UserAuthTokensEntity | null> {
    return this.repo.findOne({
      where: { accessToken: dto.accessToken, user: { id: dto.userId } },
      relations: { user: true },
    });
  }

  findByAccessTokenAndUserIdOrFail(dto: { accessToken: string; userId: number }): Promise<UserAuthTokensEntity> {
    const userToken = this.findByAccessTokenAndUserId(dto);
    if (!userToken) {
      throw new NotFoundException('User auth token not found');
    }
    return userToken;
  }

  deleteByAccessTokenAndUserId(dto: { accessToken: string; userId: number }) {
    return this.repo.delete({ accessToken: dto.accessToken, user: { id: dto.userId } });
  }
}
