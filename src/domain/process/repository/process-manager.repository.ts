import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProcessManagersEntity } from '@domain/process/entities/process-managers.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProcessManagerRepository {
  constructor(
    @InjectRepository(ProcessManagersEntity)
    private readonly repo: Repository<ProcessManagersEntity>,
  ) {}

  async findByProcessIdAndUserId(dto: { processId: string; userId: number }): Promise<ProcessManagersEntity | null> {
    return this.repo.findOne({
      where: { process: { id: dto.processId }, user: { id: dto.userId } },
      relations: {
        process: true,
        user: true,
      },
    });
  }
}
