import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737319258468 implements MigrationInterface {
    name = 'Init1737319258468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "process_images" ("processes_id" uuid NOT NULL, "files_id" integer NOT NULL, CONSTRAINT "PK_db429d0a0c372b39181ac3ee5c2" PRIMARY KEY ("processes_id", "files_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_96564087a3cb3e67d1c6eff231" ON "process_images" ("processes_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bcc139d0b76962ae28ac94052a" ON "process_images" ("files_id") `);
        await queryRunner.query(`ALTER TABLE "process_images" ADD CONSTRAINT "FK_96564087a3cb3e67d1c6eff2318" FOREIGN KEY ("processes_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "process_images" ADD CONSTRAINT "FK_bcc139d0b76962ae28ac94052a6" FOREIGN KEY ("files_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "process_images" DROP CONSTRAINT "FK_bcc139d0b76962ae28ac94052a6"`);
        await queryRunner.query(`ALTER TABLE "process_images" DROP CONSTRAINT "FK_96564087a3cb3e67d1c6eff2318"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bcc139d0b76962ae28ac94052a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96564087a3cb3e67d1c6eff231"`);
        await queryRunner.query(`DROP TABLE "process_images"`);
    }

}
