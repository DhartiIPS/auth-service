// auth-microservice/src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AuthMicroservice');
  
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.TCP,
        options: {
          host: '0.0.0.0',
          port: 5002,
          retryAttempts: 5,
          retryDelay: 3000,
        },
      },
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
      }),
    );

    await app.listen();
    logger.log('Auth Microservice listening on TCP port 5002');
    logger.log('Ready to accept TCP connections from Gateway');
  } catch (error) {
    logger.error('Failed to start Auth Microservice:', error);
    process.exit(1);
  }
}

bootstrap();