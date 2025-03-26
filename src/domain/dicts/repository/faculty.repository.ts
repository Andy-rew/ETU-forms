import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultyEntity } from '@domain/dicts/entities/faculty.entity';

@Injectable()
export class FacultyRepository {
  constructor(@InjectRepository(FacultyEntity) private readonly repo: Repository<FacultyEntity>) {}

  async saveMany(fac: FacultyEntity[]): Promise<FacultyEntity[]> {
    return this.repo.save(fac);
  }
}
