import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentTable1767002034756 implements MigrationInterface {
    name = 'CreateAppointmentTable1767002034756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "date_of_birth" date`);
        await queryRunner.query(`ALTER TABLE "users" ADD "address" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "blood_group" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "education" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "experience" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "consultation_fee" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "bio" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "available_hours" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_picture" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD "google_id" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_token_exp" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_token_exp"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "google_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_picture"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "available_hours"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "consultation_fee"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "experience"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "education"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "blood_group"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "date_of_birth"`);
    }

}
