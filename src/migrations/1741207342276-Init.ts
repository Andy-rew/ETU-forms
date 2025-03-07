import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1741207342276 implements MigrationInterface {
    name = 'Init1741207342276'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_password" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_password" ALTER COLUMN "password" SET NOT NULL`);
    }

}
