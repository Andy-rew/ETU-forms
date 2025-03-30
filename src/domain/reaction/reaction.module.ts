import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionEntity } from '@domain/reaction/entities/reaction.entity';
import { ReactionRepository } from '@domain/reaction/repository/reaction.repository';
import { CommonReactionService } from '@domain/reaction/service/common-reaction.service';
import { ReactionManager } from '@domain/reaction/manager/reaction.manager';
import { StepModule } from '@domain/step/step.module';
import { FormSchemaModule } from '@domain/form-schema/form-schema.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReactionEntity]), StepModule, FormSchemaModule],
  providers: [ReactionRepository, CommonReactionService, ReactionManager],
  exports: [ReactionRepository, CommonReactionService, ReactionManager],
})
export class ReactionModule {}
