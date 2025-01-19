import { MigrationInterface, QueryRunner } from 'typeorm';

export class RequiredPgExtensions1737318508584 implements MigrationInterface {
  name = 'RequiredPgExtensions1737318508584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`create extension IF NOT EXISTS "uuid-ossp";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
