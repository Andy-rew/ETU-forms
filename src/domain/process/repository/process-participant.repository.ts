import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProcessParticipantRepository {
  constructor(
    @InjectRepository(ProcessParticipantEntity) private readonly repo: Repository<ProcessParticipantEntity>,
  ) {}

  async findByProcessIdAndUserId(dto: { processId: string; userId: number }): Promise<ProcessParticipantEntity | null> {
    return this.repo.findOne({
      where: { process: { id: dto.processId }, user: { id: dto.userId } },
      relations: {
        process: true,
        user: true,
      },
    });
  }

  async findByProcessIdAndUserIdOrFail(dto: { processId: string; userId: number }): Promise<ProcessParticipantEntity> {
    const processParticipant = await this.findByProcessIdAndUserId(dto);
    if (!processParticipant) {
      throw new NotFoundException('ProcessParticipant not found');
    }
    return processParticipant;
  }
}
