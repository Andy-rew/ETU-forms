import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessManagersEntity } from '@domain/process/entities/process-managers.entity';

@Injectable()
export class ProcessRepository {
  constructor(
    @InjectRepository(ProcessEntity)
    private readonly repo: Repository<ProcessEntity>,
  ) {}

  async createWithManager(dto: { process: ProcessEntity; manager: UserEntity }): Promise<ProcessEntity> {
    const qr = this.repo.manager.connection.createQueryRunner();
    await qr.startTransaction();

    try {
      const process = await qr.manager.save(dto.process);
      const processManager = await qr.manager.save(ProcessManagersEntity, { user: dto.manager, process: process });
      process.userManagers = [processManager];

      await qr.commitTransaction();
      return process;
    } catch (error) {
      await qr.rollbackTransaction();
      throw new Error(error);
    } finally {
      await qr.release();
    }
  }

  async update(process: ProcessEntity): Promise<ProcessEntity> {
    return this.repo.save(process);
  }

  async softDelete(id: string) {
    await this.repo.softDelete(id);
  }

  async findByIdOrFail(id: string): Promise<ProcessEntity | null> {
    return this.repo.findOneByOrFail({ id });
  }
}
