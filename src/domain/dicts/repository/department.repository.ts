import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEntity } from '@domain/dicts/entities/department.entity';

@Injectable()
export class DepartmentRepository {
  constructor(@InjectRepository(DepartmentEntity) private readonly repo: Repository<DepartmentEntity>) {}

  async saveMany(dep: DepartmentEntity[]): Promise<DepartmentEntity[]> {
    return this.repo.save(dep);
  }
}
