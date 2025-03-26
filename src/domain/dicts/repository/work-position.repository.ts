import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkPositionsEntity } from '@domain/dicts/entities/work-positions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkPositionRepository {
  constructor(@InjectRepository(WorkPositionsEntity) private readonly repo: Repository<WorkPositionsEntity>) {}

  async saveMany(workPositions: WorkPositionsEntity[]): Promise<WorkPositionsEntity[]> {
    return this.repo.save(workPositions);
  }
}
