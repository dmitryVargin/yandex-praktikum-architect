import {IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID} from 'class-validator';
import { SensorType } from './sensor-type.enum';

export class CreateSensorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(SensorType)
  type!: SensorType;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsBoolean()
  @IsNotEmpty()
  isEnabled!: boolean;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsUUID()
  @IsOptional()
  roomId?: string;
}
