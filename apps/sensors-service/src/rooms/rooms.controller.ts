import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './room.entity';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() dto: CreateRoomDto): Promise<Room> {
    return this.roomsService.create(dto);
  }

  @Get()
  findAll(@Query('homeId') homeId?: string): Promise<Room[]> {
    if (homeId) {
      return this.roomsService.findByHome(homeId);
    }
    return this.roomsService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid', new ParseUUIDPipe()) uid: string): Promise<Room> {
    return this.roomsService.findOne(uid);
  }

  @Patch(':uid')
  update(
    @Param('uid', new ParseUUIDPipe()) uid: string,
    @Body() dto: UpdateRoomDto
  ): Promise<Room> {
    return this.roomsService.update(uid, dto);
  }

  @Delete(':uid')
  remove(@Param('uid', new ParseUUIDPipe()) uid: string): Promise<void> {
    return this.roomsService.remove(uid);
  }
}
