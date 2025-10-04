import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHomeDto {
  // @IsUUID()
  // @IsNotEmpty()
  // userId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;
}
