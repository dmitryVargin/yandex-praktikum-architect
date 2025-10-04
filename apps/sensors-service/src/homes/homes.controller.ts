import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { HomesService } from './homes.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { Home } from './home.entity';

@Controller('homes')
export class HomesController {
  constructor(private readonly homesService: HomesService) {}

  @Post()
  create(@Body() dto: CreateHomeDto): Promise<Home> {
    return this.homesService.create(dto);
  }

  @Get()
  findAll(): Promise<Home[]> {
    return this.homesService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid', new ParseUUIDPipe()) uid: string): Promise<Home> {
    return this.homesService.findOne(uid);
  }

  @Patch(':uid')
  update(
    @Param('uid', new ParseUUIDPipe()) uid: string,
    @Body() dto: UpdateHomeDto
  ): Promise<Home> {
    return this.homesService.update(uid, dto);
  }

  @Delete(':uid')
  remove(@Param('uid', new ParseUUIDPipe()) uid: string): Promise<void> {
    return this.homesService.remove(uid);
  }
}
