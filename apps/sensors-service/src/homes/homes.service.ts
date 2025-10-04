import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './home.entity';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

@Injectable()
export class HomesService {
  constructor(
    @InjectRepository(Home)
    private readonly homesRepo: Repository<Home>
  ) {}

  async create(dto: CreateHomeDto): Promise<Home> {
    const home = this.homesRepo.create(dto);
    return this.homesRepo.save(home);
  }

  async findAll(): Promise<Home[]> {
    return this.homesRepo.find();
  }

  async findOne(uid: string): Promise<Home> {
    const home = await this.homesRepo.findOne({ where: { uid } });
    if (!home) {
      throw new NotFoundException(`Home with uid ${uid} not found`);
    }
    return home;
  }

  async update(uid: string, dto: UpdateHomeDto): Promise<Home> {
    const home = await this.findOne(uid);
    Object.assign(home, dto);
    return this.homesRepo.save(home);
  }

  async remove(uid: string): Promise<void> {
    const home = await this.findOne(uid);
    await this.homesRepo.remove(home);
  }
}
