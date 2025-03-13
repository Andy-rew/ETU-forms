import { forwardRef, Module } from '@nestjs/common';
import { StepRepository } from '@domain/step/repositories/step.repository';
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

@Module({
  controllers: [ProcessAdminProcessStepController],
  imports: [
    TypeOrmModule.forFeature([StepEntity, StepExpertsEntity, StepExpertsParticipantsEntity, StepParticipantsEntity]),
    forwardRef(() => ProcessModule),
    AuthJwtAccessTokenModule,
    UserModule,
  ],
  providers: [StepRepository, CommonStepService, StepManager],
  exports: [StepRepository, CommonStepService],
})
export class StepModule {}
