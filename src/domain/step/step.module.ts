import { Module } from '@nestjs/common';
import { StepRepository } from '@domain/step/repositories/step.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StepEntity } from '@domain/step/entities/step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StepEntity])],
  providers: [StepRepository],
  exports: [StepRepository],
})
export class StepModule {}
