import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1742999519244 implements MigrationInterface {
  name = 'Init1742999519244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "groups" ADD "department_id" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_59a5caf58073e782a8ee5138be7" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_59a5caf58073e782a8ee5138be7"`);
    await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "department_id"`);
  }
}
