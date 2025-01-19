import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737324304419 implements MigrationInterface {
    name = 'Init1737324304419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "process_managers" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "process_id" uuid NOT NULL, CONSTRAINT "user-process-manager" UNIQUE ("user_id", "process_id"), CONSTRAINT "PK_23900a2822bdb8dde735a25d1a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "process_participants" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "process_id" uuid NOT NULL, CONSTRAINT "user-process-participant" UNIQUE ("user_id", "process_id"), CONSTRAINT "PK_32d738b76e3871526404b763a12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" DROP CONSTRAINT "FK_2f9c12e88c6acf14fece1954e2f"`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_auth_tokens" DROP CONSTRAINT "FK_bab7def1955bd13dcc47c036c03"`);
        await queryRunner.query(`ALTER TABLE "user_auth_tokens" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ADD CONSTRAINT "FK_2f9c12e88c6acf14fece1954e2f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_managers" ADD CONSTRAINT "FK_a9a3e01926d59f6626b84080733" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_managers" ADD CONSTRAINT "FK_df449d18116a93de327a56bb867" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_participants" ADD CONSTRAINT "FK_487f4475046ef6764c8a27f98eb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "process_participants" ADD CONSTRAINT "FK_03a63e1b0adde1468709b20b3b5" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_auth_tokens" ADD CONSTRAINT "FK_bab7def1955bd13dcc47c036c03" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth_tokens" DROP CONSTRAINT "FK_bab7def1955bd13dcc47c036c03"`);
        await queryRunner.query(`ALTER TABLE "process_participants" DROP CONSTRAINT "FK_03a63e1b0adde1468709b20b3b5"`);
        await queryRunner.query(`ALTER TABLE "process_participants" DROP CONSTRAINT "FK_487f4475046ef6764c8a27f98eb"`);
        await queryRunner.query(`ALTER TABLE "process_managers" DROP CONSTRAINT "FK_df449d18116a93de327a56bb867"`);
        await queryRunner.query(`ALTER TABLE "process_managers" DROP CONSTRAINT "FK_a9a3e01926d59f6626b84080733"`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" DROP CONSTRAINT "FK_2f9c12e88c6acf14fece1954e2f"`);
        await queryRunner.query(`ALTER TABLE "user_auth_tokens" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_auth_tokens" ADD CONSTRAINT "FK_bab7def1955bd13dcc47c036c03" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form_schema_user_templates" ADD CONSTRAINT "FK_2f9c12e88c6acf14fece1954e2f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "process_participants"`);
        await queryRunner.query(`DROP TABLE "process_managers"`);
    }

}
