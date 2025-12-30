import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';
// import { OAuthProvider } from '../enums/oauth-provider.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 100 })
  full_name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  license_number?: string;

  // Additional fields for healthcare system
  @Column({ type: 'date', nullable: true })
  date_of_birth?: Date;

  @Column({ type: 'text', nullable: true })
  address?: string;

  // Patient fields
  @Column({ nullable: true })
  blood_group?: string;

  // Doctor fields
  @Column({ type: 'text', nullable: true })
  education?: string;

  @Column({ nullable: true })
  experience?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultation_fee?: number;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  available_hours?: string;

  @Column({ type: 'text', nullable: true })
  profile_picture?: string;

  // OAuth fields
  @Column({ nullable: true })
  google_id?: string;

  // @Column({
  //   type: 'enum',
  //   enum: OAuthProvider,
  //   nullable: true,
  // })
  // oauth_provider?: OAuthProvider;

  // Password reset
  @Column({ nullable: true })
  reset_token?: string;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_exp?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}