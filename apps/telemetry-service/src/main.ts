import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {Transport} from "@nestjs/microservices";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

    app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'telemetry-service',
                brokers: ['kafka:9092'], // Адреса ваших Kafka-брокеров
            },
            consumer: {
                groupId: 'telemetry-service', // Группа потребителей
            },
        },
    });

    await app.startAllMicroservices();

  const port = parseInt(process.env.PORT || '8082', 10);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`telemetry-service listening on port ${port}`);
}
bootstrap();
