import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post
} from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { Sensor } from './sensor.entity';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post()
  create(@Body() dto: CreateSensorDto): Promise<Sensor> {
    return this.sensorsService.create(dto);
  }

  @Get()
  findAll(): Promise<Sensor[]> {
    return this.sensorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Sensor> {
    return this.sensorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSensorDto
  ): Promise<Sensor> {
    return this.sensorsService.update(id, dto);
  }

  @Patch(':id/toggle-enabled')
  toggleEnabled(@Param('id', ParseIntPipe) id: number): Promise<Sensor> {
    return this.sensorsService.toggleEnabled(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.sensorsService.remove(id);
  }

}
