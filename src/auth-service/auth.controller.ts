// auth-microservice/auth.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from '../dto/auth.dto';

@Controller()
export class AuthMicroserviceController {
  constructor(private readonly authService: AuthServiceService) {}

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() dto: LoginDto) {
    console.log('MICROSERVICE LOGIN HIT:', dto);
    return this.authService.login(dto);
  }

  @MessagePattern({ cmd: 'get_patients' })
  async getPatients() {
    return this.authService.getAllPatients();
  }

  @MessagePattern({ cmd: 'get_doctors' })
  async getDoctors() {
    return this.authService.getAllDoctors();
  }

  @MessagePattern({ cmd: 'forgot_password' })
  async forgotPassword(@Payload() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @MessagePattern({ cmd: 'reset_password' })
  async resetPassword(@Payload() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @MessagePattern({ cmd: 'get_profile' })
  async getProfile(@Payload() userId: number) {
    return this.authService.getProfile(userId);
  }

  @MessagePattern({ cmd: 'update_profile' })
  async updateProfile(@Payload() data: { userId: number; dto: UpdateProfileDto }) {
    return this.authService.updateProfile(data.userId, data.dto);
  }

  @MessagePattern({ cmd: 'upload_profile_photo' })
  async uploadProfilePhoto(@Payload() data: { userId: number; file: any }) {
    return this.authService.uploadProfilePhoto(data.userId, data.file);
  }

  @MessagePattern({ cmd: 'validate_google_user' })
  async validateGoogleUser(@Payload() googleProfile: any) {
    return this.authService.validateOrCreateGoogleUser(googleProfile);
  }
}