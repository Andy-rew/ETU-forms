import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737322251386 implements MigrationInterface {
    name = 'Init1737322251386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form_schema_filled" DROP CONSTRAINT "FK_120865386bd856875d086a2f5c9"`);
        await queryRunner.query(`ALTER TABLE "form_schema_filled" ALTER COLUMN "schema_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form_schema_filled" ADD CONSTRAINT "FK_120865386bd856875d086a2f5c9" FOREIGN KEY ("schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form_schema_filled" DROP CONSTRAINT "FK_120865386bd856875d086a2f5c9"`);
        await queryRunner.query(`ALTER TABLE "form_schema_filled" ALTER COLUMN "schema_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "form_schema_filled" ADD CONSTRAINT "FK_120865386bd856875d086a2f5c9" FOREIGN KEY ("schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
