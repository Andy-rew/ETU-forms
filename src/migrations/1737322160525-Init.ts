import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737322160525 implements MigrationInterface {
    name = 'Init1737322160525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "form_schema_filled" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "schema_id" integer, CONSTRAINT "PK_c8671e7dc703c4823c46cf78050" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."form_schema_user_templates_type_enum" AS ENUM('form', 'accept', 'decline')`);
        await queryRunner.query(`CREATE TABLE "form_schema_user_templates" ("id" SERIAL NOT NULL, "type" "public"."form_schema_user_templates_type_enum" NOT NULL DEFAULT 'form', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b3d6a377fb7c473bd66107c04d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "form_schemas" ("id" SERIAL NOT NULL, "schema" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_de572f40814e98f791c16be73a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "form_schema_filled" ADD CONSTRAINT "FK_120865386bd856875d086a2f5c9" FOREIGN KEY ("schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form_schema_filled" DROP CONSTRAINT "FK_120865386bd856875d086a2f5c9"`);
        await queryRunner.query(`DROP TABLE "form_schemas"`);
        await queryRunner.query(`DROP TABLE "form_schema_user_templates"`);
        await queryRunner.query(`DROP TYPE "public"."form_schema_user_templates_type_enum"`);
        await queryRunner.query(`DROP TABLE "form_schema_filled"`);
    }

}
