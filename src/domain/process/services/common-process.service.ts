import { BadRequestException, Injectable } from '@nestjs/common';
import { ProcessRepository } from '@domain/process/repository/process.repository';
import { CommonProcessManager } from '@domain/process/managers/common-process.manager';
import * as dayjs from 'dayjs';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { FileEntity } from '@domain/file/entities/file.entity';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessGetAllByRoleEnum } from '@domain/process/enums/process-get-all-by-role.enum';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { ProcessStatusService } from '@domain/process/services/process-status.service';
import { UserRoleEnum } from '@domain/user/enums/user-role.enum';

@Injectable()
export class CommonProcessService {
  constructor(
    private readonly processRepository: ProcessRepository,
    private readonly processManager: CommonProcessManager,
    private readonly processStatusService: ProcessStatusService,
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

  async getAll(dto: {
    role: ProcessGetAllByRoleEnum;
    limit: number;
    offset: number;
    user: UserEntity;
    status?: ProcessStatusEnum;
    title?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ count: number; processes: ProcessEntity[] }> {
    if (dto.role === ProcessGetAllByRoleEnum.all && !dto.user.roles.includes(UserRoleEnum.processAdmin)) {
      throw new BadRequestException('You should have process admin role to get all processes');
    }

    const [processes, count] = await this.processRepository.getAll({
      role: dto.role,
      limit: dto.limit,
      offset: dto.offset,
      user: dto.user,
      status: dto.status,
      title: dto.title,
      startDate: dto.startDate,
    });

    await this.processStatusService.resolveStatus(processes);

    return {
      processes,
      count,
    };
  }

  async changeStatus(dto: { processId: string; status: ProcessStatusEnum }) {
    const process = await this.processRepository.findByIdOrFail(dto.processId);
    await this.processStatusService.resolveStatus([process]);

    if (process.status === dto.status) {
      throw new BadRequestException('Process is already in this status');
    }

    switch (dto.status) {
      case ProcessStatusEnum.draft:
        if (process.status === ProcessStatusEnum.finished) {
          throw new BadRequestException('Process is finished, you cannot change status to draft');
        }
        process.status = ProcessStatusEnum.draft;
        break;
      case ProcessStatusEnum.test:
        throw new Error('Method is not implemented yet');
        break;
      case ProcessStatusEnum.inProgress:
        if (process.status === ProcessStatusEnum.finished) {
          throw new BadRequestException('Process is finished, you cannot change status to inProgress');
        }
        process.status = ProcessStatusEnum.inProgress;
        break;
      case ProcessStatusEnum.finished:
        process.status = ProcessStatusEnum.finished;
        break;
      default:
        throw new BadRequestException('Unknown status');
    }

    await this.processRepository.updateStatus(process);
  }
}
