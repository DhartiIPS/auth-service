import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1767703388451 implements MigrationInterface {
    name = 'CreateUserTable1767703388451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("user_id" SERIAL NOT NULL, "full_name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying, "role" "public"."users_role_enum" NOT NULL, "phone" character varying, "age" integer, "gender" character varying, "license_number" character varying, "date_of_birth" date, "address" text, "blood_group" character varying, "education" text, "experience" integer, "consultation_fee" numeric(10,2), "bio" text, "available_hours" character varying, "profile_picture" text, "google_id" character varying, "reset_token" character varying, "reset_token_exp" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
