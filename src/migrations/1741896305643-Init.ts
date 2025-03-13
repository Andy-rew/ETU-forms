import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1741896305643 implements MigrationInterface {
    name = 'Init1741896305643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_fd0644c177571e9e4445f57040d"`);
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_1c8c2149713be26b62f93d1151e"`);
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_03018379603667ac9d32d76c86f"`);
        await queryRunner.query(`ALTER TABLE "steps" ALTER COLUMN "form_schema_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steps" ALTER COLUMN "form_accept_schema_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steps" ALTER COLUMN "form_decline_schema_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_fd0644c177571e9e4445f57040d" FOREIGN KEY ("form_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_1c8c2149713be26b62f93d1151e" FOREIGN KEY ("form_accept_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_03018379603667ac9d32d76c86f" FOREIGN KEY ("form_decline_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_03018379603667ac9d32d76c86f"`);
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_1c8c2149713be26b62f93d1151e"`);
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_fd0644c177571e9e4445f57040d"`);
        await queryRunner.query(`ALTER TABLE "steps" ALTER COLUMN "form_decline_schema_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steps" ALTER COLUMN "form_accept_schema_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steps" ALTER COLUMN "form_schema_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_03018379603667ac9d32d76c86f" FOREIGN KEY ("form_decline_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_1c8c2149713be26b62f93d1151e" FOREIGN KEY ("form_accept_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_fd0644c177571e9e4445f57040d" FOREIGN KEY ("form_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
