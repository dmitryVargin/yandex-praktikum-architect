import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { TelemetryReading, TelemetryReadingSchema } from './schemas/telemetry-reading.schema';
import { TelemetryInitializer } from './telemetry.provider';
import { KafkaController } from "./kafka.controller";
import { TemperaturePollerService } from './temperature.poller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TelemetryReading.name, schema: TelemetryReadingSchema, collection: 'telemetry_readings' }
    ])
  ],
  controllers: [TelemetryController,KafkaController],
  providers: [TelemetryService, TelemetryInitializer, TemperaturePollerService]
})
export class TelemetryModule {}
