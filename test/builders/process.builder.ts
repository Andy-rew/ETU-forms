import { ProcessEntity } from '@domain/process/entities/process.entity';
import { FileEntity } from '@domain/file/entities/file.entity';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { INestApplication } from '@nestjs/common';
import { CommonProcessService } from '@domain/process/services/common-process.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { UserBuilder } from './user.builder';
import { CommonProcessManager } from '@domain/process/managers/common-process.manager';

export class ProcessBuilder {
  constructor(private readonly app: INestApplication) {}

  private title = 'Тестовый процесс';
  private startDate = new Date();
  private endDate = new Date();
  private status: ProcessStatusEnum = ProcessStatusEnum.draft;
  private description: string | null = null;
  private images: FileEntity[] | null = null;
  private processAdmin: UserEntity | null = null;

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

  public buildEntity(): ProcessEntity {
    const process = this.app.get(CommonProcessManager).buildForCreate({
      title: this.title,
      startDate: this.startDate,
      endDate: this.endDate,
      description: this.description,
      images: this.images,
    });

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

    return createdProcess;
  }
}
