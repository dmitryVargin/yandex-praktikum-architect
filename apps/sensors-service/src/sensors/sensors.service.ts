import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './sensor.entity';
import { CreateSensorDto } from './dto/create-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private readonly sensorsRepo: Repository<Sensor>
  ) {}

  async create(dto: CreateSensorDto): Promise<Sensor> {
    const sensor = this.sensorsRepo.create({
      ...dto,
      // default values handled by entity defaults; value defaults to 0
    });
    return this.sensorsRepo.save(sensor);
  }

  async findAll(): Promise<Sensor[]> {
    return this.sensorsRepo.find();
  }

  async findOne(id: number): Promise<Sensor> {
    const sensor = await this.sensorsRepo.findOne({ where: { id } });
    if (!sensor) {
      throw new NotFoundException(`Sensor with id ${id} not found`);
    }
    return sensor;
  }

  async update(id: number, dto: UpdateSensorDto): Promise<Sensor> {
    const sensor = await this.findOne(id);
    Object.assign(sensor, dto);
    return this.sensorsRepo.save(sensor);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.findOne(id);
    await this.sensorsRepo.remove(existing);
  }

  async toggleEnabled(id: number): Promise<Sensor> {
    const sensor = await this.findOne(id);
    sensor.isEnabled = !sensor.isEnabled;
    return this.sensorsRepo.save(sensor);
  }
}
