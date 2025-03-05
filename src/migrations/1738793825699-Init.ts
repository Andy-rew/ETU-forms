import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1738793825699 implements MigrationInterface {
  name = 'Init1738793825699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "form_schema_filled" ADD "filled_schema" jsonb NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "form_schema_filled" DROP COLUMN "filled_schema"`);
  }
}
