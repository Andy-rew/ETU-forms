import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1742593703033 implements MigrationInterface {
  name = 'Init1742593703033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steps" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "created_at"`);
  }
}
