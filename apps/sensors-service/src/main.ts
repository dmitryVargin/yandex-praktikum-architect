import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Transport} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

    app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'sensors-service',
                brokers: ['kafka:9092'], // Адреса ваших Kafka-брокеров
            },
            consumer: {
                groupId: 'sensors-service', // Группа потребителей
            },
        },
    });

    await app.startAllMicroservices();

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Device Control Service is running on http://localhost:${port}`);
}
bootstrap();
