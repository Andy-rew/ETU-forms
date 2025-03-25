import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1742851842247 implements MigrationInterface {
  name = 'Init1742851842247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "processes" DROP COLUMN "start_date"`);
    await queryRunner.query(`ALTER TABLE "processes" ADD "start_date" TIMESTAMP WITH TIME ZONE NOT NULL`);
    await queryRunner.query(`ALTER TABLE "processes" DROP COLUMN "end_date"`);
    await queryRunner.query(`ALTER TABLE "processes" ADD "end_date" TIMESTAMP WITH TIME ZONE NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "processes" DROP COLUMN "end_date"`);
    await queryRunner.query(`ALTER TABLE "processes" ADD "end_date" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "processes" DROP COLUMN "start_date"`);
    await queryRunner.query(`ALTER TABLE "processes" ADD "start_date" date NOT NULL`);
  }
}
