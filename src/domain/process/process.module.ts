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
import { ProcessUsersService } from '@domain/process/services/process-users.service';
import { StepModule } from '@domain/step/step.module';
import { UserProcessManager } from '@domain/process/managers/user-process.manager';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { ProcessController } from '@applications/http/common/process/process.controller';
import { ProcessStatusService } from '@domain/process/services/process-status.service';
import { ProcessParticipantRepository } from '@domain/process/repository/process-participant.repository';
import { FormSchemaModule } from '@domain/form-schema/form-schema.module';
import { UserProcessParticipantController } from '@applications/http/user/participant/process/user-process-participant.controller';
import { ReactionModule } from '@domain/reaction/reaction.module';
import { ExpertProcessController } from '@applications/http/user/expert/process/expert-process.controller';

@Module({
  controllers: [
    ProcessAdminProcessController,
    ProcessController,
    UserProcessParticipantController,
    ExpertProcessController,
  ],
  imports: [
    TypeOrmModule.forFeature([ProcessEntity, ProcessManagersEntity, ProcessParticipantEntity]),
    FileModule,
    AuthJwtAccessTokenModule,
    UserModule,
    StepModule,
    FormSchemaModule,
    ReactionModule,
  ],
  providers: [
    ProcessRepository,
    ProcessManagerRepository,
    ProcessParticipantRepository,
    CommonProcessManager,
    CommonProcessService,
    ProcessUsersService,
    UserProcessManager,
    ProcessStatusService,
  ],
  exports: [
    CommonProcessService,
    ProcessRepository,
    ProcessManagerRepository,
    ProcessParticipantRepository,
    ProcessUsersService,
    ProcessStatusService,
  ],
})
export class ProcessModule {}
