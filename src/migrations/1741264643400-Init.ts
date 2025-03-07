import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1741264643400 implements MigrationInterface {
    name = 'Init1741264643400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_password" ADD CONSTRAINT "FK_e3b548b238b28b1170050158167" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_password" DROP CONSTRAINT "FK_e3b548b238b28b1170050158167"`);
    }

}
