import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StepEntity } from '@domain/step/entities/step.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StepRepository {
  constructor(@InjectRepository(StepEntity) private readonly repo: Repository<StepEntity>) {}

  async findActualByProcessId(processId: string) {
    return this.repo
      .createQueryBuilder('step')
      .where('step.process_id = :processId', { processId })
      .leftJoinAndSelect('step.parent', 'parent')
      .innerJoinAndSelect('step.formSchema', 'formSchema')
      .getMany();
  }

  async findActualByProcessIdForUser(dto: { processId: string; userId: number }) {
    return this.repo
      .createQueryBuilder('step')
      .where('step.process_id = :processId', { processId: dto.processId })
      .leftJoinAndSelect('step.parent', 'parent')
      .innerJoinAndSelect('step.formSchema', 'formSchema')
      .innerJoinAndSelect('step.stepParticipants', 'stepParticipants')
      .innerJoinAndSelect('stepParticipants.processParticipant', 'processParticipant')
      .innerJoinAndSelect('processParticipant.user', 'user')
      .andWhere('user.id = :userId', { userId: dto.userId })
      .getMany();
  }

  async findOneWithProcessById(id: number): Promise<StepEntity | null> {
    return this.repo.findOne({ where: { id }, relations: { process: true, parent: true } });
  }

  async findOneWithProcessByIdOrFail(id: number): Promise<StepEntity> {
    const step = await this.findOneWithProcessById(id);
    if (!step) {
      throw new NotFoundException('Step not found');
    }
    return step;
  }

  async saveNewStep(step: StepEntity): Promise<StepEntity> {
    return this.repo.save(step);
  }

  async findAllByProcess(processId: string): Promise<StepEntity[]> {
    return this.repo.find({ where: { process: { id: processId } }, relations: { process: true, parent: true } });
  }

  async findViewById(id: number): Promise<StepEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: { process: true, parent: true, formAcceptSchema: true, formDeclineSchema: true, formSchema: true },
    });
  }

  async findViewByIdOrFail(id: number): Promise<StepEntity> {
    const step = await this.findViewById(id);
    if (!step) {
      throw new NotFoundException('Step not found');
    }
    return step;
  }

  async findOneByFormSchemaId(formSchemaId: number): Promise<StepEntity | null> {
    return this.repo
      .createQueryBuilder('step')
      .where('step.form_schema_id = :formSchemaId')
      .orWhere('step.form_accept_schema_id = :formSchemaId')
      .orWhere('step.form_decline_schema_id = :formSchemaId')
      .setParameters({ formSchemaId: formSchemaId })
      .withDeleted()
      .getOne();
  }

  async findOneByIdAndProcessId(dto: { stepId: number; processId: string }): Promise<StepEntity | null> {
    return this.repo
      .createQueryBuilder('step')
      .innerJoinAndSelect('step.process', 'process')
      .leftJoinAndSelect('step.parent', 'parent')
      .where('step.id = :stepId', { stepId: dto.stepId })
      .andWhere('process.id = :processId', { processId: dto.processId })
      .getOne();
  }

  async findOneByIdAndProcessIdOrFail(dto: { stepId: number; processId: string }): Promise<StepEntity> {
    const step = await this.findOneByIdAndProcessId(dto);
    if (!step) {
      throw new NotFoundException('Step not found');
    }
    return step;
  }

  async commonUpdate(step: StepEntity): Promise<StepEntity> {
    await this.repo.update(
      { id: step.id },
      {
        title: step.title,
        startTime: step.startTime,
        endTime: step.endTime,
        participantsCount: step.participantsCount,
        formSchema: step.formSchema ?? null,
        formAcceptSchema: step.formAcceptSchema ?? null,
        formDeclineSchema: step.formDeclineSchema ?? null,
      },
    );
    return this.findOneWithProcessById(step.id);
  }

  async findByProcessAndFormSchemaId(dto: {
    processId: string;
    formSchemaId: number;
    stepId?: number;
  }): Promise<StepEntity | null> {
    const query = this.repo
      .createQueryBuilder('step')
      .where('step.process_id = :processId')
      .andWhere((qb) => {
        qb.where('step.form_schema_id = :formSchemaId')
          .orWhere('step.form_accept_schema_id = :formSchemaId')
          .orWhere('step.form_decline_schema_id = :formSchemaId');
      })
      .setParameters({
        processId: dto.processId,
        formSchemaId: dto.formSchemaId,
      });

    if (dto.stepId) {
      query.andWhere('step.id = :stepId', { stepId: dto.stepId });
    }

    return query.getOne();
  }

  async findByProcessAndFormSchemaIdOrFail(dto: {
    processId: string;
    formSchemaId: number;
    stepId?: number;
  }): Promise<StepEntity> {
    const step = await this.findByProcessAndFormSchemaId(dto);
    if (!step) {
      throw new NotFoundException('Step for schema and process not found');
    }
    return step;
  }
}
