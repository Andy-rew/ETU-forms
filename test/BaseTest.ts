import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { RequestBuilder } from './RequestBuilder';
import { AppModule } from '@app/app.module';
import { ConfigService } from '@nestjs/config';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import * as Sinon from 'sinon';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm/data-source/DataSource';
import * as BaseTransactionModule from '@infrastructure/utils/base-transaction';

export class BaseTestClass {
  protected app: INestApplication;
  protected configService: ConfigService;
  protected queryRunner: QueryRunner;
  protected manager: EntityManager;
  protected dataSource: DataSource;
  private sandbox = Sinon.createSandbox();

  async beforeAll(): Promise<void> {
    const testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = testModule.createNestApplication();

    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: false,
      }),
    );

    await this.app.init();
    this.dataSource = this.app.get(getDataSourceToken());
    this.manager = this.dataSource.manager;
    this.queryRunner = this.manager.connection.createQueryRunner();

    await this.clearDatabase();
    this.stubDatabase();

    this.configService = this.app.get(ConfigService);
  }

  private stubDatabase() {
    const outerQueryRunner = this.queryRunner;
    const outerManager = this.dataSource.manager;

    Object.assign(outerManager, { queryRunner: outerQueryRunner });
    Object.assign(outerQueryRunner, { manager: outerManager });

    this.sandbox.stub(outerQueryRunner, 'release').callsFake(async () => {});

    this.sandbox.stub(BaseTransactionModule, 'BaseTransaction').callsFake(async () => {
      const queryRunner = outerQueryRunner;
      await queryRunner.startTransaction();
      return queryRunner;
    });

    this.sandbox.stub(DataSource.prototype, 'createQueryRunner').callsFake(function (_ = 'master') {
      return outerQueryRunner;
    });

    this.sandbox.stub(Repository.prototype, 'createQueryBuilder').callsFake(function (alias?: string, _?: QueryRunner) {
      return outerManager.createQueryBuilder(this.target, alias || this.metadata.targetName, outerQueryRunner);
    });

    this.sandbox.stub(Repository.prototype, 'save').callsFake(async function (entityOrEntities, options) {
      await outerQueryRunner.startTransaction();
      const res = outerManager.save(this.target, entityOrEntities, options);
      await outerQueryRunner.commitTransaction();
      return res;
    });

    this.sandbox.stub(Repository.prototype, 'softDelete').callsFake(async function (options) {
      return outerManager.softDelete(this.target, options);
    });
  }

  async afterAll(): Promise<void> {
    this.sandbox.restore();
    await this.queryRunner.release();
    await this.app.get(getDataSourceToken()).destroy();
    await this.app.close();
  }

  async beforeEach(): Promise<void> {
    await this.queryRunner.startTransaction('READ COMMITTED');
  }

  async afterEach(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
  }

  private async clearDatabase(): Promise<void> {
    const entities = this.app.get(getDataSourceToken()).entityMetadatas;

    await this.queryRunner.query(
      `TRUNCATE TABLE ${entities.map((el) => `"${el.tableName}"`).join(', ')} RESTART IDENTITY CASCADE;`,
    );
  }

  public getBuilder<T>(builder: new (INestApplication) => T): T {
    return new builder(this.app);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public getService<TInput = any, TResult = TInput>(typeOrToken: Type<TInput> | Function | string | symbol): TResult {
    return this.app.get(typeOrToken);
  }

  public httpRequest(): RequestBuilder {
    return new RequestBuilder(this.app, this.configService);
  }
}
