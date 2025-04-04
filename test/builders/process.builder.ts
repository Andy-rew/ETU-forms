import { ProcessEntity } from '@domain/process/entities/process.entity';
import { FileEntity } from '@domain/file/entities/file.entity';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { INestApplication } from '@nestjs/common';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserBuilder } from './user.builder';
import { CommonProcessManager } from '@domain/process/managers/common-process.manager';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';

export class ProcessBuilder {
  constructor(private readonly app: INestApplication) {}

  private title = 'Тестовый процесс';
  private startDate = dayjs().add(1, 'day').toDate();
  private endDate = dayjs().add(2, 'day').toDate();
  private status: ProcessStatusEnum = ProcessStatusEnum.draft;
  private description: string | null = null;
  private images: FileEntity[] | null = null;
  private processAdmin: UserEntity | null = null;
  private participants: UserEntity[] | null = null;

  public withTitle(title: string): this {
    this.title = title;
    return this;
  }

  public withStartDate(startDate: Date): this {
    this.startDate = startDate;
    return this;
  }

  public withEndDate(endDate: Date): this {
    this.endDate = endDate;
    return this;
  }

  public withDescription(description: string): this {
    this.description = description;
    return this;
  }

  public withImages(images: FileEntity[]): this {
    this.images = images;
    return this;
  }

  public withStatus(status: ProcessStatusEnum): this {
    this.status = status;
    return this;
  }

  public withProcessAdmin(processAdmin: UserEntity): this {
    this.processAdmin = processAdmin;
    return this;
  }

  public withParticipants(participants: UserEntity[]): this {
    this.participants = participants;
    return this;
  }

  public buildEntity(): ProcessEntity {
    const process = this.app.get(CommonProcessManager).buildForCreate({
      title: this.title,
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      images: this.images,
    });

    process.status = this.status;

    return process;
  }

  public async build(): Promise<ProcessEntity> {
    if (!this.processAdmin) {
      this.processAdmin = await new UserBuilder(this.app).build();
    }

    const process = this.buildEntity();

    const createdProcess = await this.app.get(CommonProcessService).create({
      title: process.title,
      startDate: process.startDate,
      endDate: process.endDate,
      description: process.description,
      images: process.processImages,
      processAdmin: this.processAdmin,
    });

    if (this.status !== createdProcess.status) {
      createdProcess.status = this.status;
      await this.app.get(getRepositoryToken(ProcessEntity)).save(createdProcess);
    }

    if (this.participants) {
      const participants = [];
      this.participants.forEach((participant) => {
        const processParticipant = new ProcessParticipantEntity();
        processParticipant.user = participant;
        processParticipant.process = createdProcess;
        participants.push(processParticipant);
      });

      await this.app
        .get<Repository<ProcessParticipantEntity>>(getRepositoryToken(ProcessParticipantEntity))
        .save(participants);

      createdProcess.userParticipants = participants;
    }

    return createdProcess;
  }

  async buildMany(count: number): Promise<ProcessEntity[]> {
    const processes = [];
    for (let i = 0; i < count; i++) {
      const process = this.buildEntity();
      process.title = `Test process ${i}`;
      processes.push(process);
    }

    await this.app.get<Repository<ProcessEntity>>(getRepositoryToken(ProcessEntity)).save(processes);
    return processes;
  }
}
