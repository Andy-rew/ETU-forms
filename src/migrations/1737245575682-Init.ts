import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737245575682 implements MigrationInterface {
    name = 'Init1737245575682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('invited', 'activated')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'processAdmin', 'systemAdmin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "phone" character varying, "etu_id" integer, "status" "public"."users_status_enum" NOT NULL DEFAULT 'invited', "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "allow_templates" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_88092a478cd441eb455e073cb99" UNIQUE ("etu_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_auth_tokens" ("id" SERIAL NOT NULL, "refresh_token" character varying NOT NULL, "access_token" character varying NOT NULL, "access_token_expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, "refresh_token_expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, "user_id" integer, CONSTRAINT "PK_e15c7c76bf967080b272104d828" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_auth_tokens" ADD CONSTRAINT "FK_bab7def1955bd13dcc47c036c03" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth_tokens" DROP CONSTRAINT "FK_bab7def1955bd13dcc47c036c03"`);
        await queryRunner.query(`DROP TABLE "user_auth_tokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    }

}
