import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth-service/auth.module';
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
      logging: false,
    }),

    TypeOrmModule.forFeature([User]),

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

    AuthModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService, 
    EmailService,
  ],
})
export class AppModule {}