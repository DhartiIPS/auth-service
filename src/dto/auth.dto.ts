import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsNumber, IsArray } from 'class-validator';
import { Role } from '../enums/role.enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  blood_group?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  date_of_birth?: string;

  @IsNumber()
  @IsOptional()
  hospital_id?: number;

  @IsNumber()
  @IsOptional()
  specialty_id?: number;

  @IsString()
  @IsOptional()
  education?: string;

  @IsNumber()
  @IsOptional()
  experience?: number;

  @IsArray()
  @IsOptional()
  available_days?: string[];
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  new_password: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  date_of_birth?: string;

  @IsString()
  @IsOptional()
  blood_group?: string;

  @IsString()
  @IsOptional()
  education?: string;

  @IsNumber()
  @IsOptional()
  experience?: number;

  @IsArray()
  @IsOptional()
  specialty_id?: number[];

  @IsNumber()
  @IsOptional()
  hospital_id?: number;

  @IsString()
  @IsOptional()
  license_number?: string;

  @IsNumber()
  @IsOptional()
  consultation_fee?: number;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  available_hours?: string;
}