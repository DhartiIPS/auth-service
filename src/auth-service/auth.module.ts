import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controllers
import { AuthMicroserviceController } from './auth.controller';

// Services
import { AuthServiceService } from './auth-service.service';
import { GoogleAuthService } from './google-auth.service';

// Entities
import { User } from '../entities/user.entity';

// Guards & Strategies
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

// Email Service (if needed)
import { EmailService } from '../email/email.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'defaultsecret',
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '1d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthMicroserviceController],
  providers: [
    AuthServiceService,
    GoogleAuthService,
    EmailService,
    JwtAuthGuard,
    JwtStrategy,
    GoogleStrategy,
  ],
  exports: [
    AuthServiceService,
    JwtAuthGuard,
    JwtStrategy,
    GoogleAuthService,
  ],
})
export class AuthModule {}