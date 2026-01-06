import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { Role } from '../enums/role.enum';
import { EmailService } from 'src/email/email.service';
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, UpdateProfileDto } from '../dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const baseUserData: Partial<User> = {
      email: dto.email,
      password: hashedPassword,
      full_name: dto.full_name ?? 'User',
      role: dto.role,
      phone: dto.phone,
      address: dto.address,
      date_of_birth: dto.date_of_birth ? new Date(dto.date_of_birth) : undefined,
    };

    const roleSpecificData =
      dto.role === Role.DOCTOR
        ? {
          education: dto.education,
          experience: dto.experience,
        }
        : {
          blood_group: dto.blood_group,
          age: dto.age,
          gender: dto.gender,
        };

    const user = this.userRepository.create({
      ...baseUserData,
      ...roleSpecificData,
    });

    const savedUser = await this.userRepository.save(user);

    await this.emailService.sendRegistrationEmail(
      savedUser.email,
      savedUser.full_name,
      savedUser.user_id,
      savedUser.role === Role.DOCTOR ? 'doctor' : 'patient',
    );

    return {
      user_id: savedUser.user_id,
      email: savedUser.email,
    };
  }


  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new HttpException(
        { status: false, message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user.password) {
      throw new HttpException(
        {
          status: false,
          message: 'This account uses Google OAuth. Please login with Google instead.',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new HttpException(
        { status: false, message: 'Invalid password' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    user.reset_token = token;
    user.reset_token_exp = expires;
    await this.userRepository.save(user);

    // Send password reset email via microservice
    await this.emailService.sendForgotPasswordEmail(
      user.email,
      user.full_name,
      token,
    );

    return { status: true, message: 'Reset link sent to email' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { reset_token: dto.token },
    });

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    if (!user.reset_token_exp || new Date() > user.reset_token_exp) {
      throw new HttpException(
        'Token expired or invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashed = await bcrypt.hash(dto.new_password, 10);

    user.password = hashed;
    user.reset_token = '';
    user.reset_token_exp = undefined;
    await this.userRepository.save(user);

    // Send password reset confirmation via microservice
    await this.emailService.sendPasswordResetConfirmationEmail(
      user.email,
      user.full_name,
    );

    return { status: true, message: 'Password reset successful' };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Remove sensitive fields
    const { password, reset_token, reset_token_exp, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Update common fields
    if (dto.full_name !== undefined) user.full_name = dto.full_name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.gender !== undefined) user.gender = dto.gender;
    if (dto.address !== undefined) user.address = dto.address;
    if (dto.age !== undefined) user.age = dto.age;
    if (dto.date_of_birth !== undefined) {
      user.date_of_birth = new Date(dto.date_of_birth);
    }

    // Update patient-specific fields
    if (user.role === Role.PATIENT) {
      if (dto.blood_group !== undefined) user.blood_group = dto.blood_group;
    }

    // Update doctor-specific fields
    if (user.role === Role.DOCTOR) {
      if (dto.education !== undefined) user.education = dto.education;
      if (dto.experience !== undefined) user.experience = dto.experience;
      if (dto.license_number !== undefined) user.license_number = dto.license_number;
      if (dto.consultation_fee !== undefined) user.consultation_fee = dto.consultation_fee;
      if (dto.bio !== undefined) user.bio = dto.bio;
      if (dto.available_hours !== undefined) user.available_hours = dto.available_hours;
    }

    const updatedUser = await this.userRepository.save(user);

    // Remove sensitive fields
    const { password, reset_token, reset_token_exp, ...profile } = updatedUser;
    return profile;
  }

  async validateOrCreateGoogleUser(googleProfile: {
    googleId: string;
    email: string;
    fullName: string;
    profilePicture?: string;
  }) {
    let user = await this.userRepository.findOne({
      where: { email: googleProfile.email },
    });

    if (user) {
      if (!user.google_id) {
        user.google_id = googleProfile.googleId;
        // user.oauth_provider = OAuthProvider.GOOGLE;
        user.profile_picture = googleProfile.profilePicture;
        await this.userRepository.save(user);
      }
    } else {
      user = this.userRepository.create({
        email: googleProfile.email,
        full_name: googleProfile.fullName,
        google_id: googleProfile.googleId,
        // oauth_provider: OAuthProvider.GOOGLE,
        profile_picture: googleProfile.profilePicture,
        role: Role.PATIENT,
      });
      await this.userRepository.save(user);
    }

    const payload = {
      sub: user.user_id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      profile_picture: user.profile_picture,
    };
  }

  async getAllPatients() {
    const patients = await this.userRepository.find({
      where: { role: Role.PATIENT },
    });

    return patients.map(({ password, reset_token, reset_token_exp, ...patient }) => patient);
  }

  async getAllDoctors() {
    const doctors = await this.userRepository.find({
      where: { role: Role.DOCTOR },
    });

    return doctors.map(({ password, reset_token, reset_token_exp, ...doctor }) => doctor);
  }

  async uploadProfilePhoto(userId: number, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const base64Photo = file.buffer.toString('base64');
    const photoUrl = `data:${file.mimetype};base64,${base64Photo}`;

    user.profile_picture = photoUrl;
    const updatedUser = await this.userRepository.save(user);

    return {
      message: 'Profile photo updated successfully',
      user: {
        user_id: updatedUser.user_id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        profile_picture: updatedUser.profile_picture,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return {
        valid: true,
        decoded,
      };
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({
        where: { user_id: decoded.sub },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const payload = {
        sub: user.user_id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      };

      const newToken = this.jwtService.sign(payload);

      return {
        access_token: newToken,
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
