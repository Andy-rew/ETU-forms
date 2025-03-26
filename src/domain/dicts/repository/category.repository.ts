import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '@domain/dicts/entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(@InjectRepository(CategoryEntity) private readonly repo: Repository<CategoryEntity>) {}

  async saveMany(dep: CategoryEntity[]): Promise<CategoryEntity[]> {
    return this.repo.save(dep);
  }
}
