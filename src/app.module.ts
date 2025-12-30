import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth-service/auth.controller'; // ✅ Import AuthController
import { AuthServiceService } from './auth-service/auth-service.service';
import { GoogleAuthService } from './auth-service/google-auth.service'; // ✅ If you have this
import { JwtAuthGuard } from './auth-service/jwt-auth.guard'; // ✅ If you have this
import { User } from './entities/user.entity';
import { Appointment } from './entities/appointment.entity';
import { AppointmentHistory } from './entities/appointment-history.entity';
import { DoctorAvailability } from './entities/doctor-availability.entity';
import { Notification } from './entities/notification.entity';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'user_doctor',
      entities: [
        User,
        Appointment,
        AppointmentHistory,
        DoctorAvailability,
        Notification,
      ],
      synchronize: false,
      logging: true,
    }),

    TypeOrmModule.forFeature([User]), // ✅ Add other entities if needed

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
  controllers: [
    AppController, 
    AuthController, // ✅ Add AuthController here
  ],
  providers: [
    AppService, 
    AuthServiceService, 
    EmailService,
    GoogleAuthService, // ✅ Add if you have Google OAuth
    JwtAuthGuard, // ✅ Add if you have JWT guard
  ],
})
export class AppModule {}