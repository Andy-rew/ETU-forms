import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserRepository } from '@domain/user/repository/user.repository';
import { UserAuthTokensRepository } from '@domain/user/repository/user-auth-tokens.repository';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserAuthTokensEntity])],
  providers: [UserRepository, UserAuthTokensRepository],
  exports: [UserRepository, UserAuthTokensRepository],
})
export class UserModule {}
