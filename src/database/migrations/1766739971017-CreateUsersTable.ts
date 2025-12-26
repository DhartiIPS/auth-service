import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1766739971017 implements MigrationInterface {
    name = 'CreateUsersTable1766739971017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('patient', 'doctor', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" SERIAL NOT NULL, "full_name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying, "role" "public"."users_role_enum" NOT NULL, "phone" character varying, "age" integer, "gender" character varying, "license_number" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."appointment_history_old_status_enum" AS ENUM('scheduled', 'completed', 'cancelled', 'rescheduled', 'confirmed')`);
        await queryRunner.query(`CREATE TYPE "public"."appointment_history_new_status_enum" AS ENUM('scheduled', 'completed', 'cancelled', 'rescheduled', 'confirmed')`);
        await queryRunner.query(`CREATE TABLE "appointment_history" ("history_id" SERIAL NOT NULL, "appointment_id" integer NOT NULL, "changed_by" integer, "old_status" "public"."appointment_history_old_status_enum", "new_status" "public"."appointment_history_new_status_enum" NOT NULL, "change_reason" character varying, "changed_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c45abbf091def5f9656b1e2ecc2" PRIMARY KEY ("history_id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "title" character varying NOT NULL, "message" character varying NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "appointment_id" integer, "appointmentAppointmentId" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('scheduled', 'completed', 'cancelled', 'rescheduled', 'confirmed')`);
        await queryRunner.query(`CREATE TABLE "appointments" ("appointment_id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "patient_id" integer NOT NULL, "appointment_date" date NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "status" "public"."appointments_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dde485d1b7ca51845c075befb6b" PRIMARY KEY ("appointment_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."doctor_availability_day_of_week_enum" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`);
        await queryRunner.query(`CREATE TABLE "doctor_availability" ("availability_id" SERIAL NOT NULL, "doctor_id" integer NOT NULL, "day_of_week" "public"."doctor_availability_day_of_week_enum" NOT NULL, "start_time" character varying NOT NULL, "end_time" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f9a42786501c61a0d314b3e115" PRIMARY KEY ("availability_id"))`);
        await queryRunner.query(`ALTER TABLE "appointment_history" ADD CONSTRAINT "FK_492bdb7d7fff7082d957ad2757a" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("appointment_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_ddcfa18b75cc4cf0f39a8c9b750" FOREIGN KEY ("appointmentAppointmentId") REFERENCES "appointments"("appointment_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Migration down method intentionally left empty
        // Tables and data will NOT be dropped on rollback
        console.log('Migration rollback skipped - tables preserved');
    }

}