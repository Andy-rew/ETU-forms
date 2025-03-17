import { Injectable } from '@nestjs/common';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { ProcessEntity } from '@domain/process/entities/process.entity';

@Injectable()
export class ProcessStatusService {
  constructor(private readonly processRepository: ProcessRepository) {}

  async resolveStatus(processes: ProcessEntity[]): Promise<ProcessEntity[]> {
    const processIds = processes.map((pr) => pr.id);
    const resolvedStatus = await this.processRepository.processStatusResolver({
      ids: processIds,
    });

    const statusMap = new Map(resolvedStatus.map((rs) => [rs.id, rs.realStatus]));

    for (const process of processes) {
      process.status = statusMap.get(process.id);
    }

    return processes;
  }
}
