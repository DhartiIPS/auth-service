import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

@Entity('doctor_availability')
export class DoctorAvailability {
  @PrimaryGeneratedColumn()
  availability_id: number;

  @Column()
  doctor_id: number;

  @Column({ type: 'enum', enum: DayOfWeek })
  day_of_week: DayOfWeek;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}