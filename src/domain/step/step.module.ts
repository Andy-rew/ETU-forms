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
  providers: [StepRepository, StepExpertsRepository, CommonStepService, StepManager],
  exports: [StepRepository, CommonStepService, StepExpertsRepository],
})
export class StepModule {}
