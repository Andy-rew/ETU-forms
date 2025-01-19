import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737326900509 implements MigrationInterface {
    name = 'Init1737326900509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "steps" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "participants_count" integer, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "deleted_at" TIMESTAMP, "process_id" uuid NOT NULL, "form_schema_id" integer NOT NULL, "form_accept_schema_id" integer NOT NULL, "form_decline_schema_id" integer NOT NULL, "parent_id" integer, CONSTRAINT "REL_fd0644c177571e9e4445f57040" UNIQUE ("form_schema_id"), CONSTRAINT "REL_1c8c2149713be26b62f93d1151" UNIQUE ("form_accept_schema_id"), CONSTRAINT "REL_03018379603667ac9d32d76c86" UNIQUE ("form_decline_schema_id"), CONSTRAINT "REL_05135a93baacff3f3687f42fc0" UNIQUE ("parent_id"), CONSTRAINT "PK_65f86ac8996204d11f915f66a5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_d50b87a0401c6200dff03cbc51a" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_fd0644c177571e9e4445f57040d" FOREIGN KEY ("form_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_1c8c2149713be26b62f93d1151e" FOREIGN KEY ("form_accept_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_03018379603667ac9d32d76c86f" FOREIGN KEY ("form_decline_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "steps" ADD CONSTRAINT "FK_05135a93baacff3f3687f42fc00" FOREIGN KEY ("parent_id") REFERENCES "steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_05135a93baacff3f3687f42fc00"`);
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_03018379603667ac9d32d76c86f"`);
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_1c8c2149713be26b62f93d1151e"`);
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_fd0644c177571e9e4445f57040d"`);
        await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_d50b87a0401c6200dff03cbc51a"`);
        await queryRunner.query(`DROP TABLE "steps"`);
    }

}
