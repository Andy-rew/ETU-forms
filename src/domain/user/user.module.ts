import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserRepository } from '@domain/user/repository/user.repository';
import { UserAuthTokensRepository } from '@domain/user/repository/user-auth-tokens.repository';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { UserPasswordRepository } from '@domain/user/repository/user-password.repository';
import { UserPasswordEntity } from '@domain/user/entities/user-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserAuthTokensEntity, UserPasswordEntity])],
  providers: [UserRepository, UserAuthTokensRepository, UserPasswordRepository],
  exports: [UserRepository, UserAuthTokensRepository, UserPasswordRepository],
})
export class UserModule {}
