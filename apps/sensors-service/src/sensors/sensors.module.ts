import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { KafkaController} from './kafka.controller';
import { Sensor } from './sensor.entity';
import { Home } from '../homes/home.entity';
import { Room } from '../rooms/room.entity';
import { HomesController } from '../homes/homes.controller';
import { RoomsController } from '../rooms/rooms.controller';
import { HomesService } from '../homes/homes.service';
import { RoomsService } from '../rooms/rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, Home, Room])],
  controllers: [SensorsController, KafkaController, HomesController, RoomsController],
  providers: [SensorsService, HomesService, RoomsService],
  exports: [TypeOrmModule]
})
export class SensorsModule {}
