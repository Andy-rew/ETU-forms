import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737322565069 implements MigrationInterface {
    name = 'Init1737322565069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ADD "schema_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ADD CONSTRAINT "UQ_c6d2916e7131adcd1a0bd3f457c" UNIQUE ("schema_id")`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ADD CONSTRAINT "FK_c6d2916e7131adcd1a0bd3f457c" FOREIGN KEY ("schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ADD CONSTRAINT "FK_2f9c12e88c6acf14fece1954e2f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" DROP CONSTRAINT "FK_2f9c12e88c6acf14fece1954e2f"`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" DROP CONSTRAINT "FK_c6d2916e7131adcd1a0bd3f457c"`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" DROP CONSTRAINT "UQ_c6d2916e7131adcd1a0bd3f457c"`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" DROP COLUMN "schema_id"`);
    }

}
