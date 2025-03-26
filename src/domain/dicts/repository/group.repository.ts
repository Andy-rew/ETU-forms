import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from '@domain/dicts/entities/group.entity';

@Injectable()
export class GroupRepository {
  constructor(@InjectRepository(GroupEntity) private readonly repo: Repository<GroupEntity>) {}

  async saveMany(gr: GroupEntity[]): Promise<GroupEntity[]> {
    return this.repo.save(gr);
  }
}
