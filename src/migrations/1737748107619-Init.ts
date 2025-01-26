import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1737748107619 implements MigrationInterface {
  name = 'Init1737748107619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD "surname" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD "patronymic" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "patronymic"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "surname"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
  }
}
