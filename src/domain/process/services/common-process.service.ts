import { BadRequestException, Injectable } from '@nestjs/common';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { CommonProcessManager } from '@domain/process/managers/common-process.manager';
import * as dayjs from 'dayjs';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { FileEntity } from '@domain/file/entities/file.entity';
import { UserEntity } from '@domain/user/entities/user.entity';

@Injectable()
export class CommonProcessService {
  constructor(
    private readonly processRepository: ProcessRepository,
    private readonly processManager: CommonProcessManager,
  ) {}

  /**
   * Создание процесса
   * Передаваемый пользователь назначается менеджером процесса
   * @param dto
   */
  async create(dto: {
    title: string;
    startDate: Date;
    endDate: Date;
    processAdmin: UserEntity;
    description?: string;
    images?: FileEntity[];
  }): Promise<ProcessEntity> {
    if (dayjs(dto.startDate).isAfter(dayjs(dto.endDate), 'date')) {
      throw new BadRequestException('Start date must be before or equal end date');
    }

    if (dayjs().isAfter(dayjs(dto.startDate), 'date')) {
      throw new BadRequestException('Start date must be in the future');
    }

    const process = this.processManager.buildForCreate({
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate,
      description: dto.description,
      images: dto.images,
    });

    return this.processRepository.createWithManager({ process: process, manager: dto.processAdmin });
  }

  async delete(id: string): Promise<void> {
    await this.processRepository.softDelete(id);
  }

  async update(dto: {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    description?: string;
    images?: FileEntity[];
  }): Promise<ProcessEntity> {
    if (dayjs(dto.startDate).isAfter(dayjs(dto.endDate))) {
      throw new BadRequestException('Start date must be before or equal end date');
    }

    if (dayjs().isAfter(dayjs(dto.startDate))) {
      throw new BadRequestException('Start date must be in the future');
    }

    const process = await this.processRepository.findByIdOrFail(dto.id);

    const updatedProcess = this.processManager.update({
      process: process,
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate,
      description: dto.description,
      images: dto.images,
    });

    return this.processRepository.update(updatedProcess);
  }
}
