import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1737329850825 implements MigrationInterface {
    name = 'Init1737329850825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "step_experts" ("id" SERIAL NOT NULL, "is_main" boolean NOT NULL DEFAULT false, "user_id" integer NOT NULL, "step_id" integer NOT NULL, CONSTRAINT "step_experts_unique" UNIQUE ("user_id", "step_id"), CONSTRAINT "PK_fadb880b225bc56ea2619fbfc93" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reactions_type_enum" AS ENUM('accept', 'decline')`);
        await queryRunner.query(`CREATE TABLE "reactions" ("id" SERIAL NOT NULL, "type" "public"."reactions_type_enum" NOT NULL DEFAULT 'decline', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "reaction_form_filled_id" integer NOT NULL, "reacted_by_user_id" integer NOT NULL, "step_participant_id" integer NOT NULL, CONSTRAINT "REL_35c351a8fe6470f3cd29d34d95" UNIQUE ("reaction_form_filled_id"), CONSTRAINT "PK_0b213d460d0c473bc2fb6ee27f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "step_participants" ("id" SERIAL NOT NULL, "process_participant_id" integer NOT NULL, "filled_form_id" integer, "step_id" integer NOT NULL, "main_reaction_id" integer, CONSTRAINT "step_process_participants" UNIQUE ("process_participant_id", "step_id"), CONSTRAINT "REL_7b92e12b64cd3a5414efe6c569" UNIQUE ("filled_form_id"), CONSTRAINT "REL_f8825798d77e7b3173124d56ab" UNIQUE ("main_reaction_id"), CONSTRAINT "PK_bbe1cd44ac55c5c362cdb4c9f05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "step_experts" ADD CONSTRAINT "FK_d086e244cc98bd981441321dc65" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "step_experts" ADD CONSTRAINT "FK_d1fa89bef8632c0967d7705e855" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_35c351a8fe6470f3cd29d34d958" FOREIGN KEY ("reaction_form_filled_id") REFERENCES "form_schema_filled"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_4ed2a7bc882d643c1822fe8e50c" FOREIGN KEY ("reacted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reactions" ADD CONSTRAINT "FK_a64be870814871d888ccb6b93c0" FOREIGN KEY ("step_participant_id") REFERENCES "step_participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "step_participants" ADD CONSTRAINT "FK_7cbcac9eb7cb7eea45aa4685660" FOREIGN KEY ("process_participant_id") REFERENCES "process_participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "step_participants" ADD CONSTRAINT "FK_7b92e12b64cd3a5414efe6c5694" FOREIGN KEY ("filled_form_id") REFERENCES "form_schema_filled"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "step_participants" ADD CONSTRAINT "FK_81c1e2e62811dccc2d71525b2eb" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "step_participants" ADD CONSTRAINT "FK_f8825798d77e7b3173124d56ab7" FOREIGN KEY ("main_reaction_id") REFERENCES "reactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step_participants" DROP CONSTRAINT "FK_f8825798d77e7b3173124d56ab7"`);
        await queryRunner.query(`ALTER TABLE "step_participants" DROP CONSTRAINT "FK_81c1e2e62811dccc2d71525b2eb"`);
        await queryRunner.query(`ALTER TABLE "step_participants" DROP CONSTRAINT "FK_7b92e12b64cd3a5414efe6c5694"`);
        await queryRunner.query(`ALTER TABLE "step_participants" DROP CONSTRAINT "FK_7cbcac9eb7cb7eea45aa4685660"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_a64be870814871d888ccb6b93c0"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_4ed2a7bc882d643c1822fe8e50c"`);
        await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_35c351a8fe6470f3cd29d34d958"`);
        await queryRunner.query(`ALTER TABLE "step_experts" DROP CONSTRAINT "FK_d1fa89bef8632c0967d7705e855"`);
        await queryRunner.query(`ALTER TABLE "step_experts" DROP CONSTRAINT "FK_d086e244cc98bd981441321dc65"`);
        await queryRunner.query(`DROP TABLE "step_participants"`);
        await queryRunner.query(`DROP TABLE "reactions"`);
        await queryRunner.query(`DROP TYPE "public"."reactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "step_experts"`);
    }

}
