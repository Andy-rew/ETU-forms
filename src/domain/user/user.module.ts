import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserRepository } from '@domain/user/repository/user.repository';
import { UserAuthTokensRepository } from '@domain/user/repository/user-auth-tokens.repository';
import { UserAuthTokensEntity } from '@domain/user/entities/user-auth-tokens.entity';
import { UserPasswordRepository } from '@domain/user/repository/user-password.repository';
import { UserPasswordEntity } from '@domain/user/entities/user-password.entity';
import { CommonUserService } from '@domain/user/services/common-user.service';
import { UserManager } from '@domain/user/managers/user.manager';
import { AuthModule } from '@domain/auth/auth.module';
import { MailerModule } from '@domain/mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserAuthTokensEntity, UserPasswordEntity]), AuthModule, MailerModule],
  providers: [UserRepository, UserAuthTokensRepository, UserPasswordRepository, CommonUserService, UserManager],
  exports: [UserRepository, UserAuthTokensRepository, UserPasswordRepository, CommonUserService],
})
export class UserModule {}
