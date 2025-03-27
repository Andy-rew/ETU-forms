import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessEntity } from '@domain/process/entities/process.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '@domain/user/entities/user.entity';
import { ProcessManagersEntity } from '@domain/process/entities/process-managers.entity';
import { StepExpertsEntity } from '@domain/step/entities/step-experts.entity';
import { ProcessParticipantEntity } from '@domain/process/entities/process-participant.entity';
import { ProcessGetAllByRoleEnum } from '@domain/process/enums/process-get-all-by-role.enum';
import { ProcessStatusEnum } from '@domain/process/enums/process-status.enum';
import { ProcessStatusResolveDto } from '@domain/process/dtos/processStatusResolve.dto';

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

  async findByIdWitParticipantsAndSteps(id: string): Promise<ProcessEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: { userParticipants: true, steps: { parent: true } },
    });
  }

  async findByIdWitParticipantsAndStepsOrFail(id: string): Promise<ProcessEntity> {
    const process = await this.findByIdWitParticipantsAndSteps(id);
    if (!process) {
      throw new NotFoundException('Process not found');
    }
    return process;
  }

  async createProcessManagers(processManagers: ProcessManagersEntity[]): Promise<ProcessManagersEntity[]> {
    const qr = this.repo.manager.connection.createQueryRunner();
    await qr.startTransaction();
    try {
      await qr.manager.save(processManagers);
      await qr.manager.save(processManagers.map((manager) => manager.user));

      await qr.commitTransaction();
      return processManagers;
    } catch (error) {
      await qr.rollbackTransaction();
      throw new Error(error);
    } finally {
      await qr.release();
    }
  }

  async createProcessStepExperts(processStepExperts: StepExpertsEntity[]): Promise<StepExpertsEntity[]> {
    return this.repo.manager.save(StepExpertsEntity, processStepExperts);
  }

  async createProcessParticipants(
    processParticipants: ProcessParticipantEntity[],
  ): Promise<ProcessParticipantEntity[]> {
    return this.repo.manager.save(ProcessParticipantEntity, processParticipants);
  }

  /**
   * Метод возвращает конструкцию для резолва статуса черновика процесса
   * Требуемые параметры: draftStatus
   */
  private processDraftStatusResolveWhereQuery() {
    const statusWhere = 'process.status = :draftStatus';
    const dateWhere = 'process.end_date >= :now';
    return [statusWhere, dateWhere].join(' AND ');
  }

  /**
   * Метод возвращает конструкцию для резолва статуса процесса в тестовом режиме
   * Требуемые параметры: testStatus
   */
  private processTestStatusResolveWhereQuery() {
    const statusWhere = 'process.status = :testStatus';
    const dateWhere = 'process.end_date >= :now';
    return [statusWhere, dateWhere].join(' AND ');
  }

  /**
   * Метод возвращает конструкцию для резолва статуса процесса, который запущен
   * Требуемые параметры: inProgressStatus, now
   */
  private processInProgressStatusResolveWhereQuery() {
    const statusWhere = 'process.status = :inProgressStatus';
    const dateWhere = 'process.end_date >= :now';
    return [statusWhere, dateWhere].join(' AND ');
  }

  /**
   * Метод возвращает конструкцию для резолва статуса законченного процесса
   * Требуемые параметры: finishedStatus, now
   */
  private processFinishedStatusResolveWhereQuery() {
    const statusWhere = 'process.status = :finishedStatus';
    const dateWhere = 'process.end_date < :now';
    return [statusWhere, dateWhere].join(' OR ');
  }

  /**
   * @param dto
   * Метод выполняет резолв статуса процесса для переданных идентификаторов
   */
  async processStatusResolver(dto: { ids: string[] }): Promise<ProcessStatusResolveDto[]> {
    const query = this.repo
      .createQueryBuilder('process')
      .select('DISTINCT(process.id)', 'id')
      .addSelect(
        `CASE WHEN ${this.processDraftStatusResolveWhereQuery()} THEN :draftStatus
        WHEN ${this.processTestStatusResolveWhereQuery()} THEN :testStatus
        WHEN ${this.processInProgressStatusResolveWhereQuery()} THEN :inProgressStatus 
        WHEN ${this.processFinishedStatusResolveWhereQuery()} THEN :finishedStatus END`,
        'realStatus',
      )
      .whereInIds(dto.ids)
      .setParameters({
        draftStatus: ProcessStatusEnum.draft,
        testStatus: ProcessStatusEnum.test,
        inProgressStatus: ProcessStatusEnum.inProgress,
        finishedStatus: ProcessStatusEnum.finished,
        now: new Date(),
      });

    return query.getRawMany<ProcessStatusResolveDto>();
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
  }): Promise<[ProcessEntity[], number]> {
    const now = new Date();

    const query = this.repo.createQueryBuilder('process').limit(dto.limit).offset(dto.offset);

    switch (dto.role) {
      case ProcessGetAllByRoleEnum.manager:
        query.innerJoinAndSelect('process.userManagers', 'userManagers');
        query.andWhere('userManagers.user_id = :userId');
        break;
      case ProcessGetAllByRoleEnum.expert:
        query.innerJoinAndSelect('process.steps', 'steps');
        query.innerJoinAndSelect('steps.experts', 'experts');
        query.andWhere('experts.user_id = :userId');
        break;
      case ProcessGetAllByRoleEnum.participant:
        query.innerJoinAndSelect('process.userParticipants', 'userParticipants');
        query.andWhere('userParticipants.user_id = :userId');
        break;
      case ProcessGetAllByRoleEnum.all:
        break;
      default:
        throw new BadRequestException('Invalid role');
    }

    if (dto.status) {
      switch (dto.status) {
        case ProcessStatusEnum.draft:
          query.andWhere(this.processDraftStatusResolveWhereQuery());
          break;
        case ProcessStatusEnum.test:
          query.andWhere(this.processTestStatusResolveWhereQuery());
          break;
        case ProcessStatusEnum.inProgress:
          query.andWhere(this.processInProgressStatusResolveWhereQuery());
          break;
        case ProcessStatusEnum.finished:
          query.andWhere(this.processFinishedStatusResolveWhereQuery());
          break;
        default:
          throw new BadRequestException('Invalid status');
      }
    }

    if (dto.title) {
      query.andWhere('process.title ILIKE :title');
    }

    if (dto.startDate) {
      query.andWhere('process.start_date >= :startDate');
    }

    if (dto.endDate) {
      query.andWhere('process.end_date <= :endDate');
    }

    query.setParameters({
      userId: dto.user.id,
      now: now,
      draftStatus: ProcessStatusEnum.draft,
      testStatus: ProcessStatusEnum.test,
      inProgressStatus: ProcessStatusEnum.inProgress,
      finishedStatus: ProcessStatusEnum.finished,
      title: `%${dto.title}%`,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });

    return query.getManyAndCount();
  }

  async updateStatus(process: ProcessEntity) {
    await this.repo.update(process.id, { status: process.status });
  }
}
