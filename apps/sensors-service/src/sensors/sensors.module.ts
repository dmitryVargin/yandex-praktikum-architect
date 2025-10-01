import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { KafkaController} from './kafka.controller';
import { Sensor } from './sensor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  controllers: [SensorsController, KafkaController],
  providers: [SensorsService],
  exports: [TypeOrmModule]
})
export class SensorsModule {}
