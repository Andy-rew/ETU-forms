import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { CommonProcessManager } from '@domain/process/managers/common-process.manager';
import { CommonProcessService } from '@domain/process/services/common-process.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProcessEntity])],
  providers: [ProcessRepository, CommonProcessManager, CommonProcessService],
  exports: [CommonProcessService],
})
export class ProcessModule {}
