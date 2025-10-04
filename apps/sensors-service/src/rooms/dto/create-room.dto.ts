import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  @IsNotEmpty()
  homeId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}
