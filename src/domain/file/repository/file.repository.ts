import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '@domain/file/entities/file.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class FileRepository {
  constructor(@InjectRepository(FileEntity) private readonly repo: Repository<FileEntity>) {}

  async findByIds(ids: number[]): Promise<FileEntity[]> {
    return this.repo.findBy({ id: In(ids) });
  }

  async findByIdsOrFail(ids: number[]): Promise<FileEntity[]> {
    const filesFound = await this.findByIds(ids);

    if (!filesFound.some((file) => ids.includes(file.id))) {
      throw new NotFoundException('Not all file ids found');
    }

    return filesFound;
  }
}
