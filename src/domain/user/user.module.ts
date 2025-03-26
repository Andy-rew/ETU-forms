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
import { SystemAdminUserController } from '@applications/http/system-admin/user/system-admin-user.controller';
import { AuthJwtAccessTokenModule } from '@infrastructure/module/auth-jwt-access-token.module';
import { UserDepartmentsEntity } from '@domain/user/entities/user-departments.entity';
import { UserDepartmentsRepository } from '@domain/user/repository/user-departments.repository';
import { EducationEntity } from '@domain/user/entities/education.entity';

@Module({
  controllers: [SystemAdminUserController],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserAuthTokensEntity,
      UserPasswordEntity,
      UserDepartmentsEntity,
      EducationEntity,
    ]),
    AuthModule,
    MailerModule,
    AuthJwtAccessTokenModule,
  ],
  providers: [
    UserRepository,
    UserAuthTokensRepository,
    UserPasswordRepository,
    CommonUserService,
    UserManager,
    UserDepartmentsRepository,
  ],
  exports: [
    UserRepository,
    UserAuthTokensRepository,
    UserPasswordRepository,
    CommonUserService,
    UserDepartmentsRepository,
  ],
})
export class UserModule {}
