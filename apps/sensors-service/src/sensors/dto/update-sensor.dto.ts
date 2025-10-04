import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateSensorDto } from './create-sensor.dto';
import { SensorType } from './sensor-type.enum';

export class UpdateSensorDto extends PartialType(CreateSensorDto) {
  @IsEnum(SensorType)
  @IsOptional()
  type?: SensorType;

  @IsNumber()
  @IsOptional()
  value?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  roomId?: string;
}
