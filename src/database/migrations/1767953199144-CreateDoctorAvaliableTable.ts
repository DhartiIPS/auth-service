import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDoctorAvaliableTable1767953199144 implements MigrationInterface {
    name = 'CreateDoctorAvaliableTable1767953199144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doctor_availability" ("availability_id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "day_of_week" "public"."doctor_availability_day_of_week_enum" NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f9a42786501c61a0d314b3e115" PRIMARY KEY ("availability_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "doctor_availability"`);
    }

}
