import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1738014420802 implements MigrationInterface {
  name = 'Init1738014420802';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ADD "title" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "form_schema_user_templates" DROP COLUMN "title"`);
  }
}
