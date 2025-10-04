import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { CreateReadingDto } from './dto/create-reading.dto';
import { QueryReadingsDto } from './dto/query-readings.dto';

@Controller('readings')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  create(@Body() dto: CreateReadingDto) {
    return this.telemetryService.create(dto);
  }

  @Get()
  find(@Query() query: QueryReadingsDto) {
    return this.telemetryService.find(query);
  }
}
