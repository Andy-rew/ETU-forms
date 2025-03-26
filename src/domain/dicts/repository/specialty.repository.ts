import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialtyEntity } from '@domain/dicts/entities/specialty.entity';

@Injectable()
export class SpecialtyRepository {
  constructor(@InjectRepository(SpecialtyEntity) private readonly repo: Repository<SpecialtyEntity>) {}

  async saveMany(specialtyEntities: SpecialtyEntity[]): Promise<SpecialtyEntity[]> {
    return this.repo.save(specialtyEntities);
  }
}
