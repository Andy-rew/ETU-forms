import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1738705743485 implements MigrationInterface {
  name = 'Init1738705743485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "form_schema_user_templates" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "form_schemas" ADD "title" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "form_schemas" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ADD "title" character varying NOT NULL`);
  }
}
