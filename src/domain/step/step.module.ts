import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StepEntity } from '@domain/step/entities/step.entity';
import { ProcessAdminProcessStepController } from '@applications/http/process-admin/step/process-admin-process-step.controller';
import { CommonStepService } from '@domain/step/services/common-step.service';
import { StepManager } from '@domain/step/managers/step.manager';
import { ProcessModule } from '@domain/process/process.module';
import { AuthJwtAccessTokenModule } from '@infrastructure/module/auth-jwt-access-token.module';
import { UserModule } from '@domain/user/user.module';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';
import { StepExpertsParticipantsEntity } from '@domain/step/entities/step-experts-participants.entity';
import { StepParticipantsEntity } from '@domain/step/entities/step-participants.entity';
import { StepExpertsRepository } from '@domain/step/repository/step-experts.repository';
import { StepRepository } from '@domain/step/repository/step.repository';
import { FormSchemaModule } from '@domain/form-schema/form-schema.module';
import { StepExpertsService } from '@domain/step/services/step-experts.service';
import { StepParticipantsRepository } from '@domain/step/repository/step-participants.repository';
import { StepExpertsParticipantsRepository } from '@domain/step/repository/step-experts-participants.repository';
import { StepUsersService } from '@domain/step/services/step-users.service';

@Module({
  controllers: [ProcessAdminProcessStepController],
  imports: [
    TypeOrmModule.forFeature([
      StepEntity,
      StepExpertsEntity,
      StepExpertsParticipantsEntity,
      StepParticipantsEntity,
      StepExpertsEntity,
    ]),
    forwardRef(() => ProcessModule),
    AuthJwtAccessTokenModule,
    UserModule,
    FormSchemaModule,
  ],
  providers: [
    StepRepository,
    StepExpertsRepository,
    CommonStepService,
    StepManager,
    StepExpertsService,
    StepParticipantsRepository,
    StepExpertsParticipantsRepository,
    StepUsersService,
  ],
  exports: [
    StepRepository,
    CommonStepService,
    StepExpertsRepository,
    StepParticipantsRepository,
    StepExpertsParticipantsRepository,
    StepUsersService,
  ],
})
export class StepModule {}
