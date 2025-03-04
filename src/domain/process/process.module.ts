import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { CommonProcessManager } from '@domain/process/managers/common-process.manager';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import { ProcessManagerRepository } from '@domain/process/repository/process-manager.repository';
import { ProcessManagersEntity } from '@domain/process/entities/process-managers.entity';
import { FileModule } from '@domain/file/file.module';
import { ProcessAdminProcessController } from '@applications/http/process-admin/process/process-admin-process.controller';
import { AuthJwtAccessTokenModule } from '@infrastructure/module/auth-jwt-access-token.module';
import { UserModule } from '@domain/user/user.module';

@Module({
  controllers: [ProcessAdminProcessController],
  imports: [
    TypeOrmModule.forFeature([ProcessEntity, ProcessManagersEntity]),
    FileModule,
    AuthJwtAccessTokenModule,
    UserModule,
  ],
  providers: [ProcessRepository, ProcessManagerRepository, CommonProcessManager, CommonProcessService],
  exports: [CommonProcessService, ProcessRepository, ProcessManagerRepository],
})
export class ProcessModule {}
