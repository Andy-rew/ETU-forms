import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StepEntity } from '@domain/step/entities/step.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StepRepository {
  constructor(@InjectRepository(StepEntity) private readonly repo: Repository<StepEntity>) {}

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
}
