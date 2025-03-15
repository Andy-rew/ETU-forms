import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1741817595227 implements MigrationInterface {
  name = 'Init1741817595227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "surname" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "surname" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL`);
  }
}
