import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDoctorAvaliableTable1767957712924 implements MigrationInterface {
    name = 'CreateDoctorAvaliableTable1767957712924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doctor_availability" ("availability_id" SERIAL NOT NULL, "day_of_week" "public"."doctor_availability_day_of_week_enum" NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "doctor_id" integer, CONSTRAINT "PK_3f9a42786501c61a0d314b3e115" PRIMARY KEY ("availability_id"))`);
        await queryRunner.query(`ALTER TABLE "doctor_availability" ADD CONSTRAINT "FK_2cc8d37cdcb4ecd1e726d6ed304" FOREIGN KEY ("doctor_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_availability" DROP CONSTRAINT "FK_2cc8d37cdcb4ecd1e726d6ed304"`);
        await queryRunner.query(`DROP TABLE "doctor_availability"`);
    }

}
