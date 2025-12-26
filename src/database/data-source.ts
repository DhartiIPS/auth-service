import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/user.entity';
import { Appointment } from '../entities/appointment.entity';
import { AppointmentHistory } from '../entities/appointment-history.entity';
import { DoctorAvailability } from '../entities/doctor-availability.entity';
import { Notification } from '../entities/notification.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'user_doctor',
  entities: [User, Appointment, AppointmentHistory, DoctorAvailability, Notification],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
