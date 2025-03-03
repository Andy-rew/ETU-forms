import { Injectable } from '@nestjs/common';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { FileEntity } from '@domain/file/entities/file.entity';

@Injectable()
export class CommonProcessManager {
  buildForCreate(dto: {
    title: string;
    startDate: Date;
    endDate: Date;
    description?: string | null;
    images?: FileEntity[] | null;
  }): ProcessEntity {
    const process = new ProcessEntity();
    process.title = dto.title;
    process.startDate = dto.startDate;
    process.endDate = dto.endDate;
    process.status = ProcessStatusEnum.draft;
    process.description = dto.description ?? null;
    process.processImages = dto.images ?? null;
    return process;
  }

  update(dto: {
    process: ProcessEntity;
    title: string;
    startDate: Date;
    endDate: Date;
    description?: string;
    images?: FileEntity[];
  }): ProcessEntity {
    const process = dto.process;
    process.title = dto.title;
    process.startDate = dto.startDate;
    process.endDate = dto.endDate;
    process.description = dto.description ?? null;
    process.processImages = dto.images ?? null;
    return process;
  }
}
