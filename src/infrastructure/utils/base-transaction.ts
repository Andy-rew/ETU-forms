import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

@Injectable()
export abstract class BaseTransaction {
  protected constructor(protected readonly dataSource: DataSource) {}

  protected async startTransaction(isolationLevel: IsolationLevel = 'READ COMMITTED'): Promise<QueryRunner> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(isolationLevel);
    return queryRunner;
  }
}
