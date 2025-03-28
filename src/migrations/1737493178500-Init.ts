import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1737493178500 implements MigrationInterface {
  name = 'Init1737493178500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_password" ("user_id" integer NOT NULL, "password" character varying NOT NULL, "activation_code" character varying, "activation_code_expired_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_e3b548b238b28b1170050158167" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "system_admin" ("user_id" integer NOT NULL, CONSTRAINT "PK_ffa91b1c03e3ac9dbc663cf9472" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "processes_admin" ("user_id" integer NOT NULL, CONSTRAINT "PK_9d8d67f2128d92cc05fcb0ee81a" PRIMARY KEY ("user_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "form_schema_filled" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "schema_id" integer NOT NULL, CONSTRAINT "PK_c8671e7dc703c4823c46cf78050" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "form_schemas" ("id" SERIAL NOT NULL, "schema" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_de572f40814e98f791c16be73a3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."form_schema_user_templates_type_enum" AS ENUM('form', 'accept', 'decline')`,
    );
    await queryRunner.query(
      `CREATE TABLE "form_schema_user_templates" ("id" SERIAL NOT NULL, "type" "public"."form_schema_user_templates_type_enum" NOT NULL DEFAULT 'form', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "schema_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "REL_c6d2916e7131adcd1a0bd3f457" UNIQUE ("schema_id"), CONSTRAINT "PK_6b3d6a377fb7c473bd66107c04d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" integer NOT NULL, "url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "process_managers" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "process_id" uuid NOT NULL, CONSTRAINT "user-process-manager" UNIQUE ("user_id", "process_id"), CONSTRAINT "PK_23900a2822bdb8dde735a25d1a9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."reactions_type_enum" AS ENUM('accept', 'decline')`);
    await queryRunner.query(
      `CREATE TABLE "reactions" ("id" SERIAL NOT NULL, "type" "public"."reactions_type_enum" NOT NULL DEFAULT 'decline', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "reaction_form_filled_id" integer NOT NULL, "reacted_by_user_id" integer NOT NULL, "step_participant_id" integer NOT NULL, CONSTRAINT "REL_35c351a8fe6470f3cd29d34d95" UNIQUE ("reaction_form_filled_id"), CONSTRAINT "PK_0b213d460d0c473bc2fb6ee27f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "step_participants" ("id" SERIAL NOT NULL, "process_participant_id" integer NOT NULL, "filled_form_id" integer, "step_id" integer NOT NULL, "main_reaction_id" integer, CONSTRAINT "step_process_participants" UNIQUE ("process_participant_id", "step_id"), CONSTRAINT "REL_7b92e12b64cd3a5414efe6c569" UNIQUE ("filled_form_id"), CONSTRAINT "REL_f8825798d77e7b3173124d56ab" UNIQUE ("main_reaction_id"), CONSTRAINT "PK_bbe1cd44ac55c5c362cdb4c9f05" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "step_experts_participants" ("id" SERIAL NOT NULL, "step_expert_id" integer NOT NULL, "step_participant_id" integer NOT NULL, "reaction_id" integer, CONSTRAINT "step_experts_participants_unique" UNIQUE ("step_expert_id", "step_participant_id"), CONSTRAINT "REL_789850f5589fec5613f703ca46" UNIQUE ("reaction_id"), CONSTRAINT "PK_e48b1e6cd97c74f5f16af217803" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "step_experts" ("id" SERIAL NOT NULL, "is_main" boolean NOT NULL DEFAULT false, "user_id" integer NOT NULL, "step_id" integer NOT NULL, CONSTRAINT "step_experts_unique" UNIQUE ("user_id", "step_id"), CONSTRAINT "PK_fadb880b225bc56ea2619fbfc93" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "steps" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "participants_count" integer, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, "deleted_at" TIMESTAMP, "process_id" uuid NOT NULL, "form_schema_id" integer NOT NULL, "form_accept_schema_id" integer NOT NULL, "form_decline_schema_id" integer NOT NULL, "parent_id" integer, CONSTRAINT "REL_fd0644c177571e9e4445f57040" UNIQUE ("form_schema_id"), CONSTRAINT "REL_1c8c2149713be26b62f93d1151" UNIQUE ("form_accept_schema_id"), CONSTRAINT "REL_03018379603667ac9d32d76c86" UNIQUE ("form_decline_schema_id"), CONSTRAINT "REL_05135a93baacff3f3687f42fc0" UNIQUE ("parent_id"), CONSTRAINT "PK_65f86ac8996204d11f915f66a5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."processes_status_enum" AS ENUM('inProgress', 'test', 'draft', 'finished')`,
    );
    await queryRunner.query(
      `CREATE TABLE "processes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."processes_status_enum" NOT NULL DEFAULT 'draft', "title" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "description" text, "link_access" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_566885de50f7d20a6df306c12e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "process_participants" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "process_id" uuid NOT NULL, CONSTRAINT "user-process-participant" UNIQUE ("user_id", "process_id"), CONSTRAINT "PK_32d738b76e3871526404b763a12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "specialties" ("id" SERIAL NOT NULL, "study_years" character varying NOT NULL, "cipher" character varying NOT NULL, "title" character varying NOT NULL, "lk_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba01cec5aa8ac48778a1d097e98" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "groups" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "specialty_id" integer NOT NULL, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "educations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "group_id" integer NOT NULL, CONSTRAINT "PK_09d2f29e7f6f31f5c01d79d2dbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "faculties" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "short_title" character varying NOT NULL, "lk_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "leader_id" integer, CONSTRAINT "REL_6de9e645f80eed7c63608ce705" UNIQUE ("leader_id"), CONSTRAINT "PK_fd83e4a09c7182ccf7bdb3770b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "departments" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "short_title" character varying NOT NULL, "lk_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "faculty_id" integer NOT NULL, CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "work_positions" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "short_title" character varying NOT NULL, "lk_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_25bc2ae196be409c8035320dba9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "short_title" character varying NOT NULL, "lk_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_departments" ("id" SERIAL NOT NULL, "department_id" integer NOT NULL, "position_id" integer NOT NULL, "category_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_ca8d1bbbf9bb49c79c706807fae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('invited', 'activated')`);
    await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('user', 'processAdmin', 'systemAdmin')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "phone" character varying, "etu_id" integer, "status" "public"."users_status_enum" NOT NULL DEFAULT 'invited', "roles" "public"."users_roles_enum" array NOT NULL DEFAULT '{user}', "allow_templates" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_88092a478cd441eb455e073cb99" UNIQUE ("etu_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_auth_tokens" ("id" SERIAL NOT NULL, "refresh_token" character varying NOT NULL, "access_token" character varying NOT NULL, "access_token_expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, "refresh_token_expired_at" TIMESTAMP WITH TIME ZONE NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_e15c7c76bf967080b272104d828" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "process_images" ("processes_id" uuid NOT NULL, "files_id" integer NOT NULL, CONSTRAINT "PK_db429d0a0c372b39181ac3ee5c2" PRIMARY KEY ("processes_id", "files_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_96564087a3cb3e67d1c6eff231" ON "process_images" ("processes_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_bcc139d0b76962ae28ac94052a" ON "process_images" ("files_id") `);
    await queryRunner.query(
      `ALTER TABLE "form_schema_filled" ADD CONSTRAINT "FK_120865386bd856875d086a2f5c9" FOREIGN KEY ("schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "form_schema_user_templates" ADD CONSTRAINT "FK_c6d2916e7131adcd1a0bd3f457c" FOREIGN KEY ("schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "form_schema_user_templates" ADD CONSTRAINT "FK_2f9c12e88c6acf14fece1954e2f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_managers" ADD CONSTRAINT "FK_a9a3e01926d59f6626b84080733" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_managers" ADD CONSTRAINT "FK_df449d18116a93de327a56bb867" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reactions" ADD CONSTRAINT "FK_35c351a8fe6470f3cd29d34d958" FOREIGN KEY ("reaction_form_filled_id") REFERENCES "form_schema_filled"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reactions" ADD CONSTRAINT "FK_4ed2a7bc882d643c1822fe8e50c" FOREIGN KEY ("reacted_by_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reactions" ADD CONSTRAINT "FK_a64be870814871d888ccb6b93c0" FOREIGN KEY ("step_participant_id") REFERENCES "step_participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "step_participants" ADD CONSTRAINT "FK_7cbcac9eb7cb7eea45aa4685660" FOREIGN KEY ("process_participant_id") REFERENCES "process_participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "step_participants" ADD CONSTRAINT "FK_7b92e12b64cd3a5414efe6c5694" FOREIGN KEY ("filled_form_id") REFERENCES "form_schema_filled"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "step_participants" ADD CONSTRAINT "FK_81c1e2e62811dccc2d71525b2eb" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "step_participants" ADD CONSTRAINT "FK_f8825798d77e7b3173124d56ab7" FOREIGN KEY ("main_reaction_id") REFERENCES "reactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "step_experts_participants" ADD CONSTRAINT "FK_69c1acfe5c483902ec6098a2279" FOREIGN KEY ("step_expert_id") REFERENCES "step_experts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "step_experts_participants" ADD CONSTRAINT "FK_12757e5117c2545bb5cc5a640b3" FOREIGN KEY ("step_participant_id") REFERENCES "step_participants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "step_experts_participants" ADD CONSTRAINT "FK_789850f5589fec5613f703ca46b" FOREIGN KEY ("reaction_id") REFERENCES "reactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "step_experts" ADD CONSTRAINT "FK_d086e244cc98bd981441321dc65" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "step_experts" ADD CONSTRAINT "FK_d1fa89bef8632c0967d7705e855" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_d50b87a0401c6200dff03cbc51a" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_fd0644c177571e9e4445f57040d" FOREIGN KEY ("form_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_1c8c2149713be26b62f93d1151e" FOREIGN KEY ("form_accept_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_03018379603667ac9d32d76c86f" FOREIGN KEY ("form_decline_schema_id") REFERENCES "form_schemas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_05135a93baacff3f3687f42fc00" FOREIGN KEY ("parent_id") REFERENCES "steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_participants" ADD CONSTRAINT "FK_487f4475046ef6764c8a27f98eb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_participants" ADD CONSTRAINT "FK_03a63e1b0adde1468709b20b3b5" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_8494f9b9970d10004fa7a6ed4bd" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" ADD CONSTRAINT "FK_ed30b84b392640d53591405a1f7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" ADD CONSTRAINT "FK_100de0aa429b56bc108dda7fbb6" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "faculties" ADD CONSTRAINT "FK_6de9e645f80eed7c63608ce7052" FOREIGN KEY ("leader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "departments" ADD CONSTRAINT "FK_db9cbab5eb895126fc1689dc2ad" FOREIGN KEY ("faculty_id") REFERENCES "faculties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_departments" ADD CONSTRAINT "FK_f10514cebc5e624f08c1b558081" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_departments" ADD CONSTRAINT "FK_47069ee63dcb38779cb016c8b08" FOREIGN KEY ("position_id") REFERENCES "work_positions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_departments" ADD CONSTRAINT "FK_a55d3514f12b7cbd5203ebd48c6" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_departments" ADD CONSTRAINT "FK_78098f9a7c51985e96b5326bca9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_auth_tokens" ADD CONSTRAINT "FK_bab7def1955bd13dcc47c036c03" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_images" ADD CONSTRAINT "FK_96564087a3cb3e67d1c6eff2318" FOREIGN KEY ("processes_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "process_images" ADD CONSTRAINT "FK_bcc139d0b76962ae28ac94052a6" FOREIGN KEY ("files_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "process_images" DROP CONSTRAINT "FK_bcc139d0b76962ae28ac94052a6"`);
    await queryRunner.query(`ALTER TABLE "process_images" DROP CONSTRAINT "FK_96564087a3cb3e67d1c6eff2318"`);
    await queryRunner.query(`ALTER TABLE "user_auth_tokens" DROP CONSTRAINT "FK_bab7def1955bd13dcc47c036c03"`);
    await queryRunner.query(`ALTER TABLE "user_departments" DROP CONSTRAINT "FK_78098f9a7c51985e96b5326bca9"`);
    await queryRunner.query(`ALTER TABLE "user_departments" DROP CONSTRAINT "FK_a55d3514f12b7cbd5203ebd48c6"`);
    await queryRunner.query(`ALTER TABLE "user_departments" DROP CONSTRAINT "FK_47069ee63dcb38779cb016c8b08"`);
    await queryRunner.query(`ALTER TABLE "user_departments" DROP CONSTRAINT "FK_f10514cebc5e624f08c1b558081"`);
    await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT "FK_db9cbab5eb895126fc1689dc2ad"`);
    await queryRunner.query(`ALTER TABLE "faculties" DROP CONSTRAINT "FK_6de9e645f80eed7c63608ce7052"`);
    await queryRunner.query(`ALTER TABLE "educations" DROP CONSTRAINT "FK_100de0aa429b56bc108dda7fbb6"`);
    await queryRunner.query(`ALTER TABLE "educations" DROP CONSTRAINT "FK_ed30b84b392640d53591405a1f7"`);
    await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_8494f9b9970d10004fa7a6ed4bd"`);
    await queryRunner.query(`ALTER TABLE "process_participants" DROP CONSTRAINT "FK_03a63e1b0adde1468709b20b3b5"`);
    await queryRunner.query(`ALTER TABLE "process_participants" DROP CONSTRAINT "FK_487f4475046ef6764c8a27f98eb"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_05135a93baacff3f3687f42fc00"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_03018379603667ac9d32d76c86f"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_1c8c2149713be26b62f93d1151e"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_fd0644c177571e9e4445f57040d"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP CONSTRAINT "FK_d50b87a0401c6200dff03cbc51a"`);
    await queryRunner.query(`ALTER TABLE "step_experts" DROP CONSTRAINT "FK_d1fa89bef8632c0967d7705e855"`);
    await queryRunner.query(`ALTER TABLE "step_experts" DROP CONSTRAINT "FK_d086e244cc98bd981441321dc65"`);
    await queryRunner.query(`ALTER TABLE "step_experts_participants" DROP CONSTRAINT "FK_789850f5589fec5613f703ca46b"`);
    await queryRunner.query(`ALTER TABLE "step_experts_participants" DROP CONSTRAINT "FK_12757e5117c2545bb5cc5a640b3"`);
    await queryRunner.query(`ALTER TABLE "step_experts_participants" DROP CONSTRAINT "FK_69c1acfe5c483902ec6098a2279"`);
    await queryRunner.query(`ALTER TABLE "step_participants" DROP CONSTRAINT "FK_f8825798d77e7b3173124d56ab7"`);
    await queryRunner.query(`ALTER TABLE "step_participants" DROP CONSTRAINT "FK_81c1e2e62811dccc2d71525b2eb"`);
    await queryRunner.query(`ALTER TABLE "step_participants" DROP CONSTRAINT "FK_7b92e12b64cd3a5414efe6c5694"`);
    await queryRunner.query(`ALTER TABLE "step_participants" DROP CONSTRAINT "FK_7cbcac9eb7cb7eea45aa4685660"`);
    await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_a64be870814871d888ccb6b93c0"`);
    await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_4ed2a7bc882d643c1822fe8e50c"`);
    await queryRunner.query(`ALTER TABLE "reactions" DROP CONSTRAINT "FK_35c351a8fe6470f3cd29d34d958"`);
    await queryRunner.query(`ALTER TABLE "process_managers" DROP CONSTRAINT "FK_df449d18116a93de327a56bb867"`);
    await queryRunner.query(`ALTER TABLE "process_managers" DROP CONSTRAINT "FK_a9a3e01926d59f6626b84080733"`);
    await queryRunner.query(
      `ALTER TABLE "form_schema_user_templates" DROP CONSTRAINT "FK_2f9c12e88c6acf14fece1954e2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "form_schema_user_templates" DROP CONSTRAINT "FK_c6d2916e7131adcd1a0bd3f457c"`,
    );
    await queryRunner.query(`ALTER TABLE "form_schema_filled" DROP CONSTRAINT "FK_120865386bd856875d086a2f5c9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_bcc139d0b76962ae28ac94052a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_96564087a3cb3e67d1c6eff231"`);
    await queryRunner.query(`DROP TABLE "process_images"`);
    await queryRunner.query(`DROP TABLE "user_auth_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_departments"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "work_positions"`);
    await queryRunner.query(`DROP TABLE "departments"`);
    await queryRunner.query(`DROP TABLE "faculties"`);
    await queryRunner.query(`DROP TABLE "educations"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "specialties"`);
    await queryRunner.query(`DROP TABLE "process_participants"`);
    await queryRunner.query(`DROP TABLE "processes"`);
    await queryRunner.query(`DROP TYPE "public"."processes_status_enum"`);
    await queryRunner.query(`DROP TABLE "steps"`);
    await queryRunner.query(`DROP TABLE "step_experts"`);
    await queryRunner.query(`DROP TABLE "step_experts_participants"`);
    await queryRunner.query(`DROP TABLE "step_participants"`);
    await queryRunner.query(`DROP TABLE "reactions"`);
    await queryRunner.query(`DROP TYPE "public"."reactions_type_enum"`);
    await queryRunner.query(`DROP TABLE "process_managers"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "form_schema_user_templates"`);
    await queryRunner.query(`DROP TYPE "public"."form_schema_user_templates_type_enum"`);
    await queryRunner.query(`DROP TABLE "form_schemas"`);
    await queryRunner.query(`DROP TABLE "form_schema_filled"`);
    await queryRunner.query(`DROP TABLE "processes_admin"`);
    await queryRunner.query(`DROP TABLE "system_admin"`);
    await queryRunner.query(`DROP TABLE "user_password"`);
  }
}
