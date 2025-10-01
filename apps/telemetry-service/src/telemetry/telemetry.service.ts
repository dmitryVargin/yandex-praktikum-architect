import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { TelemetryReading, TelemetryReadingDocument } from './schemas/telemetry-reading.schema';
import { CreateReadingDto } from './dto/create-reading.dto';
import { QueryReadingsDto } from './dto/query-readings.dto';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectModel(TelemetryReading.name)
    private readonly telemetryModel: Model<TelemetryReadingDocument>
  ) {}

  async create(dto: CreateReadingDto) {
      const doc = await this.telemetryModel.create({
      sensorId: dto.sensorId,
      timestamp: dto.timestamp ?? new Date(),
      value: dto.value,
      unit: dto.unit,
    });

      return doc;
  }

  async find(query: QueryReadingsDto) {
      const filter: FilterQuery<TelemetryReadingDocument> = { sensorId: query.sensorId };
    if (query.from || query.to) {
      filter.timestamp = {};
      if (query.from) filter.timestamp.$gte = query.from;
      if (query.to) filter.timestamp.$lte = query.to;
    }
    const limit = query.limit ?? 1000;
    return this.telemetryModel.find(filter).sort({ timestamp: -1 }).limit(limit).exec();
  }
}
