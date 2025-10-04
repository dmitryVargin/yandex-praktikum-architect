import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReadingDto {
  @IsString()
  @IsNotEmpty()
  sensorId!: string;

  @IsOptional()
  @Type(() => Date)
  timestamp?: Date;

  @IsNumber()
  @Type(() => Number)
  value!: number;

  @IsEnum(['C', 'F', 'HPa', 'Percent'] as const)
  unit!: 'C' | 'F' | 'HPa' | 'Percent';
}
