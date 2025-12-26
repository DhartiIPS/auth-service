import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Create the microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP, 
    options: {
      host: '127.0.0.1',   
      port: Number(process.env.PORT) || 5002,
    },
  });

  await app.listen();
}

bootstrap();
