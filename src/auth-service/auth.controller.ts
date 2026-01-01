// auth-microservice/src/modules/auth/auth.controller.ts
import { Controller, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from '../dto/auth.dto';

@Controller()
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: false,
  }),
)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthServiceService) {}
 
  
  @MessagePattern({ cmd: 'register' })
  async register(@Payload() dto: RegisterDto) {
    this.logger.log(`📝 Register request for: ${dto.email}`);
    try {
      const result = await this.authService.register(dto);
      this.logger.log(`  Registration successful for: ${dto.email}`);
      return {
        status: true,
        data: result,
        message: 'Registration successful',
      };
    } catch (error) {
      this.logger.error(`Registration failed for ${dto.email}:`, error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Registration failed',
        statusCode: error.status || 500,
      });
    }
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() dto: LoginDto) {
    this.logger.log(`Login request for: ${dto.email}`);
    try {
      const result = await this.authService.login(dto);
      this.logger.log(`Login successful for: ${dto.email}`);
      return {
        status: true,
        data: result,
        message: 'Login successful',
      };
    } catch (error) {
      this.logger.error(`Login failed for ${dto.email}:`, error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Invalid credentials',
        statusCode: error.status || 401,
      });
    }
  }

  @MessagePattern({ cmd: 'refresh_token' })
  async refreshToken(@Payload() payload: { refreshToken: string }) {
    this.logger.log('Refresh token request');
    try {
      const result = await this.authService.refreshToken(payload.refreshToken);
      return {
        status: true,
        data: result,
        message: 'Token refreshed successfully',
      };
    } catch (error) {
      this.logger.error('Token refresh failed:', error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Token refresh failed',
        statusCode: error.status || 401,
      });
    }
  }

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(@Payload() payload: { token: string }) {
    this.logger.log('Validate token request');
    try {
      const result = await this.authService.validateToken(payload.token);
      return {
        status: true,
        data: result,
        message: 'Token is valid',
      };
    } catch (error) {
      this.logger.error('Token validation failed:', error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Invalid token',
        statusCode: 401,
      });
    }
  }
  
  @MessagePattern({ cmd: 'get_patients' })
  async getPatients() {
    this.logger.log('📋 Get all patients request');
    try {
      const result = await this.authService.getAllPatients();
      this.logger.log(`Retrieved ${result.length} patients`);
      return {
        status: true,
        data: result,
        message: 'Patients retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to get patients:', error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Failed to retrieve patients',
        statusCode: error.status || 500,
      });
    }
  }

  @MessagePattern({ cmd: 'get_doctors' })
  async getDoctors() {
    this.logger.log('Get all doctors request');
    try {
      const result = await this.authService.getAllDoctors();
      this.logger.log(`Retrieved ${result.length} doctors`);
      return {
        status: true,
        data: result,
        message: 'Doctors retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to get doctors:', error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Failed to retrieve doctors',
        statusCode: error.status || 500,
      });
    }
  }
  
  @MessagePattern({ cmd: 'forgot_password' })
  async forgotPassword(@Payload() dto: ForgotPasswordDto) {
    this.logger.log(`🔑 Forgot password request for: ${dto.email}`);
    try {
      const result = await this.authService.forgotPassword(dto);
      this.logger.log(`  Password reset email sent to: ${dto.email}`);
      return {
        status: true,
        data: result,
        message: 'Password reset link sent to email',
      };
    } catch (error) {
      this.logger.error(`Forgot password failed for ${dto.email}:`, error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Failed to process forgot password',
        statusCode: error.status || 500,
      });
    }
  }

  @MessagePattern({ cmd: 'reset_password' })
  async resetPassword(@Payload() dto: ResetPasswordDto) {
    this.logger.log('Reset password request');
    try {
      const result = await this.authService.resetPassword(dto);
      this.logger.log('  Password reset successful');
      return {
        status: true,
        data: result,
        message: 'Password reset successful',
      };
    } catch (error) {
      this.logger.error('  Password reset failed:', error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Failed to reset password',
        statusCode: error.status || 400,
      });
    }
  }
  
  @MessagePattern({ cmd: 'get_profile' })
  async getProfile(@Payload() payload: { userId: number | string }) {
    const userId = Number(payload.userId);
    this.logger.log(`👤 Get profile request for user: ${userId}`);
    try {
      const result = await this.authService.getProfile(userId);
      this.logger.log(`  Profile retrieved for user: ${userId}`);
      return {
        status: true,
        data: result,
        message: 'Profile retrieved successfully',
      };
    } catch (error) {
      this.logger.error(`  Failed to get profile for user ${userId}:`, error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Failed to retrieve profile',
        statusCode: error.status || 404,
      });
    }
  }

  @MessagePattern({ cmd: 'update_profile' })
  async updateProfile(
    @Payload()
    payload: {
      userId: number | string;
      dto: UpdateProfileDto;
    },
  ) {
    const userId = Number(payload.userId);
    this.logger.log(`✏️ Update profile request for user: ${userId}`);
    try {
      const result = await this.authService.updateProfile(userId, payload.dto);
      this.logger.log(`  Profile updated for user: ${userId}`);
      return {
        status: true,
        data: result,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      this.logger.error(`  Failed to update profile for user ${userId}:`, error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Failed to update profile',
        statusCode: error.status || 500,
      });
    }
  }

  @MessagePattern({ cmd: 'upload_profile_photo' })
  async uploadProfilePhoto(
    @Payload()
    payload: {
      userId: number;
      file: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
      };
    },
  ) {
    this.logger.log(`📸 Upload profile photo request for user: ${payload.userId}`);
    try {
      const file: Express.Multer.File = {
        buffer: Buffer.from(payload.file.buffer),
        mimetype: payload.file.mimetype,
        originalname: payload.file.originalname,
        fieldname: 'file',
        encoding: '7bit',
        size: payload.file.buffer.length,
      } as Express.Multer.File;

      const result = await this.authService.uploadProfilePhoto(
        payload.userId,
        file,
      );
      
      this.logger.log(`  Profile photo uploaded for user: ${payload.userId}`);
      return {
        status: true,
        data: result,
        message: 'Profile photo uploaded successfully',
      };
    } catch (error) {
      this.logger.error(`  Failed to upload photo for user ${payload.userId}:`, error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Failed to upload profile photo',
        statusCode: error.status || 500,
      });
    }
  }

  
  @MessagePattern({ cmd: 'validate_google_user' })
  async validateGoogleUser(
    @Payload()
    googleProfile: {
      googleId: string;
      email: string;
      fullName: string;
      profilePicture?: string;
    },
  ) {
    this.logger.log(`  Google OAuth request for: ${googleProfile.email}`);
    try {
      const result = await this.authService.validateOrCreateGoogleUser(googleProfile);
      this.logger.log(`Google authentication successful for: ${googleProfile.email}`);
      return {
        status: true,
        data: result,
        message: 'Google authentication successful',
      };
    } catch (error) {
      this.logger.error(`  Google auth failed for ${googleProfile.email}:`, error.message);
      throw new RpcException({
        status: false,
        message: error.message || 'Google authentication failed',
        statusCode: error.status || 500,
      });
    }
  }
}