import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepo: Repository<Room>
  ) {}

  async create(dto: CreateRoomDto): Promise<Room> {
    const room = this.roomsRepo.create(dto);
    return this.roomsRepo.save(room);
  }

  async findAll(): Promise<Room[]> {
    return this.roomsRepo.find();
  }

  async findByHome(homeId: string): Promise<Room[]> {
    return this.roomsRepo.find({ where: { homeId } });
  }

  async findOne(uid: string): Promise<Room> {
    const room = await this.roomsRepo.findOne({ where: { uid } });
    if (!room) {
      throw new NotFoundException(`Room with uid ${uid} not found`);
    }
    return room;
  }

  async update(uid: string, dto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(uid);
    Object.assign(room, dto);
    return this.roomsRepo.save(room);
  }

  async remove(uid: string): Promise<void> {
    const room = await this.findOne(uid);
    await this.roomsRepo.remove(room);
  }
}
